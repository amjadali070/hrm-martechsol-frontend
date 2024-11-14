import React from 'react';

interface MenuItem {
  icon: string;
  label: string;
  isActive?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/debad705c08d8737112ae461841db3ac1e1c7f9404428ab16796229c8c81d2b1?apiKey=02167e3214b44bfe959b524b41556861&", label: "Dashboard", isActive: true },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/7e0d011c1dbd6b9b4da5c0fc8cbb60d3e7e6e56ddb4da815edf17689ebc87bde?apiKey=02167e3214b44bfe959b524b41556861&", label: "Employee Management" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/95db722889869ad6a2b097ea874f87f93f4672457442b51dca465650921c0d4a?apiKey=02167e3214b44bfe959b524b41556861&", label: "Forms" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/50f651289b8585f59dd6dbca81b86931ea91351da6cc7ecd401398b5045147e6?apiKey=02167e3214b44bfe959b524b41556861&", label: "Attendance" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/880f491ea5779febc9895fba68553ef41909b7f22d4fed0930c83e9cd2fff5cd?apiKey=02167e3214b44bfe959b524b41556861&", label: "Payroll Management" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/880f491ea5779febc9895fba68553ef41909b7f22d4fed0930c83e9cd2fff5cd?apiKey=02167e3214b44bfe959b524b41556861&", label: "Tickets" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/880f491ea5779febc9895fba68553ef41909b7f22d4fed0930c83e9cd2fff5cd?apiKey=02167e3214b44bfe959b524b41556861&", label: "Policies" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/880f491ea5779febc9895fba68553ef41909b7f22d4fed0930c83e9cd2fff5cd?apiKey=02167e3214b44bfe959b524b41556861&", label: "Blog" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/880f491ea5779febc9895fba68553ef41909b7f22d4fed0930c83e9cd2fff5cd?apiKey=02167e3214b44bfe959b524b41556861&", label: "Training Room" },
];

const Sidebar: React.FC = () => {
  return (
    <nav className="flex flex-col w-[22%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col pt-14 pb-96 mx-auto w-full text-lg text-white bg-zinc-800 shadow-[11px_4px_14px_rgba(0,0,0,0.12)] max-md:pb-24 max-md:mt-10">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex gap-6 px-10 py-6 ${
              item.isActive
                ? 'bg-sky-500'
                : 'border border-solid border-white border-opacity-10'
            } shadow-[11px_4px_14px_rgba(0,0,0,0.12)] max-md:px-5`}
          >
            <img
              loading="lazy"
              src={item.icon}
              alt=""
              className="object-contain shrink-0 w-[34px] aspect-square"
            />
            <div className="grow shrink my-auto">{item.label}</div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;