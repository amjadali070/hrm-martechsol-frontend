import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-wrap gap-5 justify-between w-full text-lg font-bold text-white max-md:max-w-full">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/1501fb49f118e220ceb1c5ff308655345adebdbc0fce1cb5a72d5893b0b780e9?apiKey=02167e3214b44bfe959b524b41556861&"
        alt="Company logo"
        className="object-contain my-auto aspect-[6.06] w-[369px]"
      />
      <div className="flex gap-6">
        <div className="flex shrink-0 my-auto bg-purple-900 rounded-full shadow-sm h-[53px] w-[59px]" aria-hidden="true" />
        <button className="flex gap-2.5 px-5 py-5 bg-red-600 rounded-[100px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/e9627bed1f9db0152f7bf8d5498f3f7243c9badfd3b8890c23197cd675262fb1?apiKey=02167e3214b44bfe959b524b41556861&"
            alt=""
            className="object-contain shrink-0 my-auto w-6 aspect-square"
          />
          <span>Time Out</span>
        </button>
        <button className="flex gap-2.5 px-8 py-5 bg-neutral-700 rounded-[100px] max-md:px-5">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/02167e3214b44bfe959b524b41556861/fcef878f8e5d8417b8bb2b3955fd9c96f9197ac99baad6910e3ac1f9e506d388?apiKey=02167e3214b44bfe959b524b41556861&"
            alt=""
            className="object-contain shrink-0 aspect-[0.96] w-[23px]"
          />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;