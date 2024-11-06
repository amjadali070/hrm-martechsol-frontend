// frontend/src/components/WriteMessage.tsx

import React from 'react';
import InputMessage from '../../atoms/InputMessage'; // Adjust the path accordingly

const WriteMessage: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white rounded-3xl">
      <div className="flex gap-3 flex-col">
        <div className="flex flex-col w-full mt-1">
          <section>
            <InputMessage />
          </section>
        </div>
      </div>
    </div>
  );
};

export default WriteMessage;
