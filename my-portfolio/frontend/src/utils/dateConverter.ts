// @ts-ignore
import NepaliDate from "nepali-date-converter";

export interface DateConversionResult {
  adStr: string; // YYYY-MM-DD format
  bsStr: string; // YYYY-MM-DD BS format (Months 1-12)
  yearBs: number;
  monthBs: number; // 0-11 indexed or 1-12 indexed?
  dayBs: number;
  yearAd?: number;
  monthAd?: number;
  dayAd?: number;
}

// Convert Gregorian/English Date (AD) to Bikram Sambat (BS)
export function convertAdToBs(adDateStr: string): DateConversionResult | null {
  if (!adDateStr) return null;
  try {
    const parts = adDateStr.split("-");
    if (parts.length !== 3) return null;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    // Quick out-of-bounds check for Gregorian years mapping to 2000-2090 BS
    if (year < 1943 || year > 2034) {
      return null;
    }
    
    const adDate = new Date(year, month, day);
    const nepaliDate = new NepaliDate(adDate);
    
    // getYear() returns the BS year (e.g. 2080)
    // getMonth() returns 0-11 for BS months
    // getDate() returns the BS day of the month
    const yearBs = nepaliDate.getYear();
    const monthBsIndex = nepaliDate.getMonth(); // 0 to 11
    const dayBs = nepaliDate.getDate();
    
    const monthBsNum = monthBsIndex + 1;
    const bsStr = `${yearBs}-${String(monthBsNum).padStart(2, "0")}-${String(dayBs).padStart(2, "0")}`;
    
    return {
      adStr: adDateStr,
      bsStr,
      yearBs,
      monthBs: monthBsNum,
      dayBs,
      yearAd: year,
      monthAd: month + 1,
      dayAd: day
    };
  } catch (err: any) {
    if (err && err.message && err.message.includes("doesn't fall within")) {
      // Gracefully return null for out-of-bounds ranges during typing
    } else {
      console.error("Error in convertAdToBs:", err);
    }
    return null;
  }
}

// Convert Bikram Sambat (BS) to Gregorian/English Date (AD)
export function convertBsToAd(yearBs: number, monthBs: number, dayBs: number): DateConversionResult | null {
  try {
    // Restrict inputs to valid BS calendar bounds recognized by the library (2000 - 2090)
    if (yearBs < 2000 || yearBs > 2090 || monthBs < 1 || monthBs > 12 || dayBs < 1 || dayBs > 32) {
      return null;
    }
    // Limit December (Chaitra) in 2090 BS specifically if it is out of bonds
    if (yearBs === 2090 && monthBs === 12 && dayBs > 30) {
      return null;
    }

    // nepali-date-converter month input is 0-indexed (0 to 11)
    const nepaliDate = new NepaliDate(yearBs, monthBs - 1, dayBs);
    const adDate: Date = nepaliDate.toJsDate();
    
    const yearAd = adDate.getFullYear();
    const monthAd = adDate.getMonth() + 1;
    const dayAd = adDate.getDate();
    
    const adStr = `${yearAd}-${String(monthAd).padStart(2, "0")}-${String(dayAd).padStart(2, "0")}`;
    const bsStr = `${yearBs}-${String(monthBs).padStart(2, "0")}-${String(dayBs).padStart(2, "0")}`;
    
    return {
      adStr,
      bsStr,
      yearBs,
      monthBs,
      dayBs,
      yearAd,
      monthAd,
      dayAd
    };
  } catch (err: any) {
    if (err && err.message && err.message.includes("doesn't fall within")) {
      // Gracefully return null for out-of-bounds ranges during typing
    } else {
      console.error("Error in convertBsToAd:", err);
    }
    return null;
  }
}

export const NEPALI_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra"
];
