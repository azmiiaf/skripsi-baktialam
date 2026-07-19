import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Custom styled DatePicker component matching the user's design reference
 */
const ModernDatePicker = ({
  selected,
  onChange,
  placeholder = "Pilih tanggal",
  ...props
}) => {
  // Custom header for the datepicker
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 rounded-t-xl">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 text-gray-600"
        type="button"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="font-bold text-lg text-gray-800">
        {date.toLocaleString("default", { month: "long", year: "numeric" })}
      </div>

      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 text-gray-600"
        type="button"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors pointer-events-none z-10">
        <CalendarIcon size={18} />
      </div>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        className="w-full pl-12! pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 shadow-sm hover:border-gray-300 text-gray-700 font-medium placeholder:text-gray-400"
        calendarClassName="modern-calendar shadow-xl border border-gray-100 !rounded-2xl !font-sans overflow-hidden !bg-white"
        renderCustomHeader={CustomHeader}
        showPopperArrow={false}
        placeholderText={placeholder}
        wrapperClassName="w-full"
        dayClassName={() => "transition-colors"}
        {...props}
      />
      <style>{`
        .modern-calendar .react-datepicker__header {
          background-color: white;
          border-bottom: none;
          padding: 0;
        }
        .modern-calendar .react-datepicker__triangle {
          display: none;
        }
        
        /* Day Names (S M T W T F S) */
        .modern-calendar .react-datepicker__day-name {
          color: #1f2937; /* gray-800 */
          font-weight: 700;
          width: 2.5rem;
          margin-top: 0.5rem;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
        
        /* Date Cells */
        .modern-calendar .react-datepicker__day {
          width: 2.5rem;
          line-height: 2.5rem;
          margin: 0.1rem;
          color: #374151; /* gray-700 */
          font-weight: 500;
          border-radius: 9999px;
        }

        /* Hover State */
        .modern-calendar .react-datepicker__day:hover {
          background-color: #e0f2f1 !important; /* teal-50 */
          color: #009688 !important; /* teal-500 */
        }

        /* Selected State */
        .modern-calendar .react-datepicker__day--selected,
        .modern-calendar .react-datepicker__day--keyboard-selected {
          background-color: #009688 !important; /* teal-500 matching the design */
          color: white !important;
          border-radius: 9999px;
          font-weight: 600;
          box-shadow: 0 4px 6px -1px rgba(0, 150, 136, 0.3);
        }

        /* Today's Date */
        .modern-calendar .react-datepicker__day--today {
          font-weight: 700;
          color: #009688;
        }
        
        .modern-calendar .react-datepicker__day--today.react-datepicker__day--selected {
           color: white;
        }

        /* Outside Month Days */
        .modern-calendar .react-datepicker__day--outside-month {
          color: #d1d5db; /* gray-300 */
        }
        
        .modern-calendar .react-datepicker__month {
          margin: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ModernDatePicker;
