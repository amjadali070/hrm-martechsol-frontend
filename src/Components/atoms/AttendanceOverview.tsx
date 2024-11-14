import React from 'react';

interface AttendanceRecord {
  date: string;
  timeIn: string;
  timeOut: string;
  totalTime: string;
  status: string;
}

const attendanceRecords: AttendanceRecord[] = [
  { date: "11 Nov 2024", timeIn: "11:58AM", timeOut: "9:41PM", totalTime: "9:42", status: "COMPLETED" },
  { date: "11 Nov 2024", timeIn: "11:58AM", timeOut: "9:41PM", totalTime: "9:42", status: "COMPLETED" },
  { date: "11 Nov 2024", timeIn: "11:58AM", timeOut: "9:41PM", totalTime: "9:42", status: "COMPLETED" },
  { date: "11 Nov 2024", timeIn: "11:58AM", timeOut: "9:41PM", totalTime: "9:42", status: "COMPLETED" },
  { date: "11 Nov 2024", timeIn: "11:58AM", timeOut: "9:41PM", totalTime: "9:42", status: "COMPLETED" },
];

const AttendanceOverview: React.FC = () => {
  return (
    <section className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col px-8 pt-8 mx-auto w-full bg-white rounded-xl max-md:pl-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex flex-wrap gap-10 max-md:max-w-full">
          <h2 className="grow shrink text-3xl font-bold text-black w-[268px]">Attendance Overview</h2>
          <button className="px-14 pt-2 pb-5 text-sm text-center text-white bg-sky-500 rounded-[30px] max-md:px-5">
            View All
          </button>
        </div>
        <div className="flex flex-col pb-3 mt-6 w-full text-sm text-center text-black rounded-md border border-solid border-zinc-300 max-md:max-w-full">
          <div className="flex z-10 gap-5 justify-between px-5 py-2.5 mt-0 text-white bg-purple-900 rounded-md max-md:max-w-full">
            <div>Date</div>
            <div>Time In</div>
            <div>Time Out</div>
            <div>Total Time</div>
            <div>Status</div>
          </div>
          {attendanceRecords.map((record, index) => (
            <div
              key={index}
              className={`flex gap-10 ${
                index % 2 === 1 ? 'bg-gray-200' : ''
              } px-5 py-2.5 mt-${index === 0 ? '4' : '2.5'} max-md:max-w-full`}
            >
              <div className="grow">{record.date}</div>
              <div>{record.timeIn}</div>
              <div>{record.timeOut}</div>
              <div>{record.totalTime}</div>
              <div>{record.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttendanceOverview;