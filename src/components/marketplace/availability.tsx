import * as React from "react";
import { useState, useEffect } from "react";
import GreenButton from "@/components/buttons/green-button";

export function Availability({
  subtitle,
  selectedAvailability,
  setSelectedAvailability,
}: {
  subtitle: string;
  selectedAvailability: string[];
  setSelectedAvailability: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_OF_THE_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const HOURS_AM = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
  ];
  const HOURS_PM = [
    "12",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
  ];

  const today = new Date();

  const [isOpen, setIsOpen] = useState(false);
  // const [selectedAvailability, setSelectedAvailability] = useState([... selectedAvailability]);

  const handleSave = () => {
    setIsOpen(false);
    setSelectedAvailability(selectedAvailability.sort());
  };

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (
      selectedAvailability.some(
        (a) =>
          a === `${date.toISOString().substring(0, 10)}:${e.currentTarget.id}`
      )
    ) {
      return;
    }
    setSelectedAvailability([
      ...selectedAvailability,
      `${date.toISOString().substring(0, 10)}:${e.currentTarget.id}`,
    ]);
  };

  const handleDelete = (strInArray: string): void => {
    if (!selectedAvailability.some((a) => a === strInArray)) {
      return;
    }
    setSelectedAvailability(
      selectedAvailability.filter((a) => a !== strInArray).sort()
    );
  };

  const findDayInSelectedAvailability = (d: number): boolean => {
    return selectedAvailability.some(
      (a) =>
        a.split(":")[0] ===
        `${new Date(year, month, d).toISOString().substring(0, 10)}`
    );
  };

  const findDayHourInSelectedAvailability = (hh24: string): boolean => {
    const true_hh24 = hh24.substring(hh24.length - 2);
    return selectedAvailability.some(
      (a) => a === `${date.toISOString().substring(0, 10)}:${true_hh24}`
    );
  };

  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [date, setDate] = useState(new Date(year, month, day));

  const [startDay, setStartDay] = useState(getStartDayOfMonth(date));

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartDay(getStartDayOfMonth(date));
  }, [date]);

  function getStartDayOfMonth(date: Date) {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return startDate === 0 ? 7 : startDate;
  }

  function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const days = isLeapYear(year) ? DAYS_LEAP : DAYS;

  return (
    <div className={"relative mb-6"}>
      <h3 className="text-[18px] text-darkest-green mb-3">{subtitle}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedAvailability.map((item, index) => (
          <div
            key={index}
            className="px-4 py-1 rounded-full border border-input-border-gray text-darkest-green text-sm hover:bg-gray-200"
          >
            {item.substring(5)}
            <button
              className="font-extrabold text-[32px] ml-2 align-middle"
              onClick={() => handleDelete(item)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <GreenButton
        className={"mt-6"}
        variant={"action"}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        Add
      </GreenButton>
      {isOpen && (
        <div
          className={
            "absolute z-10 bg-primary-white border mt-1 overflow-y-auto shadow-md"
          }
        >
          <div className={" min-w-[650px]  shadow-amber-500 shadow-[2px]"}>
            <div
              className={
                " text-[40px] font-bold  pt-2.5 px-2.5 pb-1.25 flex justify-between bg-light-green"
              }
            >
              <div
                className={`cursor-pointer text-[32px] ${year == today.getFullYear() && month == today.getMonth() ? " text-zinc-500 " : "text-zinc-900 "}`}
                onClick={() => {
                  if (
                    !(
                      year * 100 + month - 1 >=
                      today.getFullYear() * 100 + today.getMonth()
                    )
                  ) {
                    return;
                  }
                  setDate(new Date(year, month - 1, day));
                }}
              >
                &lt;&lt;
              </div>
              <div className={"text-zinc-900"}>
                {MONTHS[month]} {year}
              </div>
              <div
                className={"cursor-pointer text-zinc-900 text-[32px]"}
                onClick={() => setDate(new Date(year, month + 1, day))}
              >
                &gt;&gt;{" "}
              </div>
            </div>
            <div className={" w-[100%] flex flex-wrap"}>
              {DAYS_OF_THE_WEEK.map((d) => (
                <div
                  key={d}
                  className={
                    "w-[14.2%] text-center text-zinc-900 h-[40px] flex items-center justify-center cursor-pointer"
                  }
                >
                  <strong>{d}</strong>
                </div>
              ))}
              {Array(days[month] + (startDay - 1))
                .fill(null)
                .map((_, index) => {
                  const d = index - (startDay - 2);
                  return (
                    <div
                      className={
                        "w-[14.2%] text-center text-zinc-900 h-[40px] flex items-center justify-center cursor-pointer" +
                        ` ${d == today.getDate() ? " border-1 border-primary-white " : " border-1 border-primary-white "} ` + // for the current day
                        ` ${d == day ? "bg-light-green" : ""} ` + // for the selected day
                        ` ${findDayInSelectedAvailability(d) ? "underline decoration-primary-orange underline-offset-3 decoration-4" : ""} ` + // for the day having selected hours
                        ` ${year * 10000 + month * 100 + d < today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate() ? "bg-zinc-300" : ""} `
                      }
                      key={index}
                      // isToday={d === today.getDate()}
                      // isSelected={d === day}
                      onClick={() => {
                        if (
                          year * 10000 + month * 100 + d <
                          today.getFullYear() * 10000 +
                            today.getMonth() * 100 +
                            today.getDate()
                        ) {
                          return;
                        }
                        setDate(new Date(year, month, d));
                      }}
                    >
                      {d > 0 ? d : ""}
                    </div>
                  );
                })}
            </div>
            <div
              className={
                "w-[100%] text-center text-zinc-900 border-t-1 border-zinc-400 flex flex-row mt-3"
              }
            >
              <div className={"w-[9%]"}>AM:</div>
              {HOURS_AM.map((h) => (
                <div
                  className={
                    "w-[8%] cursor-pointer" +
                    ` ${findDayHourInSelectedAvailability(`00${h}`) ? "underline decoration-primary-orange underline-offset-3 decoration-4" : ""} ` // for the selected hours
                  }
                  onClick={handleClick}
                  key={`${h}`}
                  id={`${h}`}
                >
                  {h}
                </div>
              ))}
            </div>
            <div
              className={
                "w-[100%] text-center text-zinc-900 border-t-1 border-b-1 border-zinc-400 flex flex-row"
              }
            >
              <div className={"w-[9%]"}>PM:</div>
              {HOURS_PM.map((h) => (
                <div
                  className={
                    "w-[8%] cursor-pointer" +
                    ` ${findDayHourInSelectedAvailability(`00${parseInt(h) < 12 ? 12 + parseInt(h) : parseInt(h)}`) ? "underline decoration-primary-orange underline-offset-3 decoration-4" : ""} `
                  }
                  onClick={handleClick}
                  key={`${parseInt(h) < 12 ? 12 + parseInt(h) : parseInt(h)}`}
                  id={`${parseInt(h) < 12 ? 12 + parseInt(h) : parseInt(h)}`}
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
          <div className={"w-[100%] flex justify-end mt-4"}>
            <GreenButton
              className={"m-3"}
              variant={"action"}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </GreenButton>
            <GreenButton
              className={"m-3"}
              variant={"action"}
              onClick={handleSave}
            >
              Save
            </GreenButton>
          </div>
        </div>
      )}
    </div>
  );
}
