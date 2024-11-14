import React from 'react';

interface Announcement {
  title: string;
  isHighlighted: boolean;
}

const announcements: Announcement[] = [
  { title: "Eid Holidays", isHighlighted: true },
  { title: "Final Payroll for the month of October 2024", isHighlighted: false },
  { title: "Final Payroll for the month of October 2024", isHighlighted: false },
  { title: "Final Payroll for the month of October 2024", isHighlighted: false },
];

const Announcements: React.FC = () => {
  return (
    <section className="flex flex-col px-12 py-9 mt-10 w-full bg-white rounded-xl max-md:px-5 max-md:mr-2 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between max-md:max-w-full">
        <h2 className="my-auto text-3xl font-bold text-black">Announcement(s)</h2>
        <button className="px-16 py-2.5 text-xl text-center text-white bg-sky-500 rounded-[30px] max-md:px-5">
          View All
        </button>
      </div>
      {announcements.map((announcement, index) => (
        <div
          key={index}
          className={`flex flex-wrap gap-5 justify-between px-6 py-3 mt-${
            index === 0 ? '6' : '4'
          } text-xl ${
            announcement.isHighlighted
              ? 'text-white bg-zinc-800'
              : 'bg-gray-200 text-zinc-600'
          } rounded-[100px] max-md:px-5 max-md:max-w-full`}
        >
          <div>{announcement.title}</div>
          <img
            loading="lazy"
            src={`http://b.io/ext_${announcement.isHighlighted ? '10' : '11'}-`}
            alt=""
            className="object-contain shrink-0 self-start aspect-[1.61] w-[37px]"
          />
        </div>
      ))}
    </section>
  );
};

export default Announcements;