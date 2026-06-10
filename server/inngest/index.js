import { Inngest } from "inngest";
import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import sendEmail from "../config/nodemailer.js";

export const inngest = new Inngest({
  id: "fullstack-ems",
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// ======================================================
// AUTO CHECKOUT
// ======================================================

const autoCheckOut = inngest.createFunction(
  {
    id: "auto-check-out",
    trigger: {
      event: "employee/check-in",
    },
  },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    const db = await connectDB();

    // Wait 9 hours
    await step.sleep("wait-for-9-hours", "9h");

    let attendance = await db.collection("attendance").findOne({
      _id: new ObjectId(attendanceId),
    });

    if (!attendance || attendance.checkOut) {
      return { skipped: true };
    }

    const employee = await db.collection("employees").findOne({
      _id: new ObjectId(employeeId),
    });

    if (employee?.email) {
      await sendEmail({
        to: employee.email,
        subject: "Attendance Check-Out Reminder",
        body: `
          <div style="font-family:Arial,sans-serif">
            <h2>Hi ${employee.firstName}, 👋</h2>

            <p>
              You checked in today at
              <strong>
                ${new Date(attendance.checkIn).toLocaleTimeString()}
              </strong>
            </p>

            <p>
              Please remember to check out within the next hour.
            </p>

            <p>
              If you have already checked out, please ignore this email.
            </p>

            <br/>

            <p>Best Regards,</p>
            <p><strong>QuickEMS</strong></p>
          </div>
        `,
      });
    }

    // Wait another hour
    await step.sleep("wait-for-1-hour", "1h");

    attendance = await db.collection("attendance").findOne({
      _id: new ObjectId(attendanceId),
    });

    if (!attendance || attendance.checkOut) {
      return { skipped: true };
    }

    const autoCheckoutTime = new Date(
      new Date(attendance.checkIn).getTime() + 10 * 60 * 60 * 1000,
    );

    await db.collection("attendance").updateOne(
      {
        _id: new ObjectId(attendanceId),
      },
      {
        $set: {
          checkOut: autoCheckoutTime,
          workingHours: 10,
          dayType: "FULL_DAY",
          status: "PRESENT",
          autoCheckout: true,
          updatedAt: new Date(),
        },
      },
    );

    return {
      success: true,
      autoCheckedOut: true,
    };
  },
);

// ======================================================
// LEAVE APPLICATION REMINDER
// ======================================================

const leaveApplicationReminder = inngest.createFunction(
  {
    id: "leave-application-reminder",
    trigger: {
      event: "leave/pending",
    },
  },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    const db = await connectDB();

    await step.sleep("wait-for-24-hours", "24h");

    const leaveApplication = await db.collection("leaveApplications").findOne({
      _id: new ObjectId(leaveApplicationId),
    });

    if (!leaveApplication || leaveApplication.status !== "PENDING") {
      return;
    }

    const employee = await db.collection("employees").findOne({
      _id: new ObjectId(leaveApplication.employeeId),
    });

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: "Leave Application Reminder",
      body: `
        <div style="font-family:Arial,sans-serif">
          <h2>Hi Admin 👋</h2>

          <p>
            A leave application is still pending approval.
          </p>

          <p>
            <strong>Employee:</strong>
            ${employee?.firstName || ""} ${employee?.lastName || ""}
          </p>

          <p>
            <strong>Department:</strong>
            ${employee?.department || "N/A"}
          </p>

          <p>
            <strong>Leave Type:</strong>
            ${leaveApplication.type}
          </p>

          <p>
            <strong>Start Date:</strong>
            ${new Date(leaveApplication.startDate).toLocaleDateString()}
          </p>

          <p>
            <strong>End Date:</strong>
            ${new Date(leaveApplication.endDate).toLocaleDateString()}
          </p>

          <br/>

          <p>Please review this leave request.</p>

          <br/>

          <p>Best Regards,</p>
          <p><strong>QuickEMS</strong></p>
        </div>
      `,
    });

    return {
      success: true,
    };
  },
);

// ======================================================
// DAILY ATTENDANCE REMINDER
// Runs at 11:30 AM IST
// ======================================================

const attendanceReminderCron = inngest.createFunction(
  {
    id: "attendance-reminder-cron",
    cron: "TZ=Asia/Kolkata 30 11 * * *",
  },
  async ({ step }) => {
    const db = await connectDB();

    const today = await step.run("calculate-ist-day-range", async () => {
      const now = new Date();

      const istDate = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
      );

      const start = new Date(istDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      return {
        start,
        end,
      };
    });

    const activeEmployees = await step.run("get-active-employees", async () => {
      return await db
        .collection("employees")
        .find({
          isDeleted: false,
          employmentStatus: "ACTIVE",
        })
        .toArray();
    });

    const approvedLeaves = await step.run("get-approved-leaves", async () => {
      return await db
        .collection("leaveApplications")
        .find({
          status: "APPROVED",
          startDate: {
            $lte: today.end,
          },
          endDate: {
            $gte: today.start,
          },
        })
        .toArray();
    });

    const attendanceRecords = await step.run(
      "get-attendance-records",
      async () => {
        return await db
          .collection("attendance")
          .find({
            date: {
              $gte: today.start,
              $lt: today.end,
            },
          })
          .toArray();
      },
    );

    const leaveIds = approvedLeaves.map((leave) => leave.employeeId.toString());

    const checkedInIds = attendanceRecords.map((attendance) =>
      attendance.employeeId.toString(),
    );

    const absentEmployees = activeEmployees.filter(
      (employee) =>
        !leaveIds.includes(employee._id.toString()) &&
        !checkedInIds.includes(employee._id.toString()),
    );

    await step.run("send-reminder-mails", async () => {
      await Promise.all(
        absentEmployees.map((employee) =>
          sendEmail({
            to: employee.email,
            subject: "Attendance Reminder",
            body: `
                <div style="font-family:Arial,sans-serif">
                  <h2>Hi ${employee.firstName}, 👋</h2>

                  <p>
                    You have not marked attendance today.
                  </p>

                  <p>
                    Please check in as soon as possible.
                  </p>

                  <p>
                    <strong>Department:</strong>
                    ${employee.department}
                  </p>

                  <br/>

                  <p>Best Regards,</p>
                  <p><strong>QuickEMS</strong></p>
                </div>
              `,
          }),
        ),
      );
    });

    return {
      totalEmployees: activeEmployees.length,
      onLeave: leaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  },
);

// ======================================================
// EXPORT
// ======================================================

export const functions = [
  autoCheckOut,
  leaveApplicationReminder,
  attendanceReminderCron,
];
