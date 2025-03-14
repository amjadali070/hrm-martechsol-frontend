// src/html/SalarySlipPDF.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/LogoMartechSol.png";
import backgroundImage from "../assets/v_background.svg";

const colors = {
  purple900: "#581c87",
  white: "#FFFFFF",
  gray600: "#718096",
  gray800: "#2D3748",
  lightGray: "#f3f4f6",
  grayforRows: "#e8e8e8",
  black: "#000000",
  cellBg: "#d1d5db", // Background for attendance cells
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 5, // reduced bottom padding
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.2,
    color: colors.gray800,
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "100%",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  header: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  logo: {
    width: 120,
    marginBottom: 4,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    marginBottom: 3,
  },
  date: {
    fontSize: 9,
    color: colors.gray600,
    fontStyle: "italic",
  },
  section: {
    marginTop: 2,
    backgroundColor: colors.lightGray,
    padding: 4,
    borderRadius: 4,
    marginBottom: 2,
  },
  sectionTitle: {
    backgroundColor: colors.purple900,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 11,
    textAlign: "center",
    marginBottom: 2,
    borderRadius: 4,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "center",
  },
  tableRowHeader: {
    fontSize: 10,
    color: colors.black,
    padding: 6,
    backgroundColor: colors.grayforRows,
    borderRadius: 4,
  },
  tableCol: {
    fontSize: 10,
    color: colors.gray800,
    padding: 6,
    borderRadius: 4,
  },
  amountPayableHeading: {
    fontFamily: "Helvetica-Bold",
    padding: 8,
    fontSize: 10,
    color: colors.white,
    backgroundColor: colors.purple900,
    width: "49%",
    borderRadius: 4,
    marginRight: "1%",
  },
  amountPayableData: {
    fontFamily: "Helvetica-Bold",
    padding: 8,
    fontSize: 10,
    color: colors.black,
    backgroundColor: colors.white,
    width: "49%",
    borderRadius: 4,
    marginLeft: "1%",
  },
  detailsTwoColumnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsColumn: {
    width: "48%",
  },

  attendanceCell: {
    width: "15.66%",
    backgroundColor: colors.grayforRows,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.lightGray,
    color: colors.black,
    padding: 2,
    margin: 1,
    textAlign: "center",
  },
  attendanceCellText: {
    fontSize: 7,
    textAlign: "center",
    color: colors.gray800,
  },

  subSectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    textAlign: "left",
    marginTop: 4,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 5,
    color: colors.black,
    fontStyle: "italic",
    lineHeight: 1.2,
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.purple900,
    marginTop: 70,
    marginBottom: 10,
  },

  attendanceSection: {
    marginTop: 2,
    marginBottom: 2,
  },
  attendanceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    width: "100%",
  },
  attendanceColumn: {
    width: "24%",
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    padding: 4,
  },
  columnHeader: {
    backgroundColor: colors.grayforRows,
    padding: 4,
    borderRadius: 4,
    marginBottom: 2,
  },
  columnHeaderText: {
    color: colors.black,
    fontSize: 10,
    textAlign: "center",
  },
  statBlock: {
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: 4,
    marginBottom: 2,
    textAlign: "center",
    marginTop: 4,
  },
  statValue: {
    fontSize: 12,
    color: colors.black,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 8,
    color: colors.gray800,
    textAlign: "center",
    marginTop: 2,
  },
  deductionValue: {
    fontSize: 10,
    color: colors.gray800,
    textAlign: "center",
    padding: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  datesContainer: {
    marginTop: 4,
  },
  dateItem: {
    backgroundColor: colors.white,
    padding: 3,
    borderRadius: 2,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 7,
    color: colors.gray800,
    textAlign: "center",
  },
});

interface SalarySlipPDFProps {
  data: {
    date: string;
    name: string;
    department: string;
    jobTitle: string;
    month: string;
    year: string;
    basicSalary: string;
    medicalAllowance: string;
    mobileAllowance: string;
    fuelAllowance: string;
    grossSalary: string;
    tax: string;
    eobi: string;
    pfContribution: string;
    absentDeductions?: string;
    amountPayable: string;
    allowances?: string;
    extraPayments?: { description: string; amount: string }[];
    absentDates?: string[];
    leaveDates?: { date: string; type: string }[];
    leaveDetails?: {
      casualLeaveAvailable?: string;
      sickLeaveAvailable?: string;
      annualLeaveAvailable?: string;
    };
    totalAbsents?: number;
    totalAbsentDeductions?: string;
    totalLateIns?: number;
    totalLateInDeductions?: string;
    totalHalfDays?: number;
    totalHalfDayDeductions?: string;
    halfDayDates?: string[];
    lateInDates?: string[];
    leaveTypeCounts?: { [key: string]: number };
  };
}

const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^0-9.-]+/g, ""));
};

const formatCurrency = (value: string | number): string => {
  let numericValue: number;
  if (typeof value === "string") {
    numericValue = parseCurrency(value);
  } else {
    numericValue = value;
  }
  return (
    "PKR " +
    numericValue.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })
  );
};

const SalarySlipPDF: React.FC<SalarySlipPDFProps> = ({ data }) => {
  const totalDeductionsNumber =
    parseCurrency(data.tax) +
    parseCurrency(data.eobi) +
    parseCurrency(data.pfContribution) +
    parseCurrency(data.absentDeductions || "PKR 0");

  const totalDeductionsFormatted = formatCurrency(totalDeductionsNumber);

  const totalAttendenceDeductions =
    (data.totalAbsentDeductions
      ? parseCurrency(data.totalAbsentDeductions)
      : 0) +
    (data.totalLateInDeductions
      ? parseCurrency(data.totalLateInDeductions)
      : 0) +
    (data.totalHalfDayDeductions
      ? parseCurrency(data.totalHalfDayDeductions)
      : 0);

  const totalLeaveDays = Object.values(data.leaveTypeCounts || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header section remains unchanged */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>Salary Slip</Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.black,
                fontFamily: "Helvetica-Bold",
                marginTop: 4,
              }}
            >
              {data.month} {data.year}
            </Text>
          </View>
        </View>

        {/* Personal Details Section - unchanged */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Name
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.name}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Department
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.department}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Job Title
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.jobTitle}
              </Text>
            </View>
          </View>
        </View>

        {/* Salary Details Section - Updated with formatted values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Details</Text>
          <View style={styles.detailsTwoColumnContainer}>
            <View style={styles.detailsColumn}>
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableRowHeader,
                    { width: "48%", marginLeft: "2%" },
                  ]}
                >
                  Basic Salary
                </Text>
                <Text style={[styles.tableCol, { width: "50%" }]}>
                  {formatCurrency(data.basicSalary)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableRowHeader,
                    { width: "48%", marginLeft: "2%" },
                  ]}
                >
                  Medical Allowance
                </Text>
                <Text style={[styles.tableCol, { width: "50%" }]}>
                  {formatCurrency(data.medicalAllowance)}
                </Text>
              </View>
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableRowHeader, { width: "48%" }]}>
                  Mobile Allowance
                </Text>
                <Text style={[styles.tableCol, { width: "50%" }]}>
                  {formatCurrency(data.mobileAllowance)}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableRowHeader, { width: "48%" }]}>
                  Fuel Allowance
                </Text>
                <Text style={[styles.tableCol, { width: "50%" }]}>
                  {formatCurrency(data.fuelAllowance)}
                </Text>
              </View>
            </View>
          </View>
          {/* Gross Salary Row */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "49%", textAlign: "center", marginRight: "1%" },
                ]}
              >
                Gross Salary
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  {
                    width: "49%",
                    textAlign: "center",
                    backgroundColor: colors.white,
                    marginLeft: "1%",
                  },
                ]}
              >
                {formatCurrency(data.grossSalary)}
              </Text>
            </View>
          </View>
        </View>

        {/* Attendance Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Attendance Overview and Deductions
          </Text>
          <View style={styles.attendanceGrid}>
            <View style={styles.attendanceColumn}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.columnHeaderText}>
                  Total Absents: {data.totalAbsents}{" "}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text>
                  {data.totalAbsentDeductions
                    ? formatCurrency(data.totalAbsentDeductions)
                    : formatCurrency(0)}
                </Text>
                {/* <Text style={styles.statValue}>{data.totalAbsents}</Text> */}
                <Text style={styles.statLabel}></Text>
              </View>
              {/* <View style={styles.deductionValue}>
                <Text>
                  {data.totalAbsentDeductions
                    ? formatCurrency(data.totalAbsentDeductions)
                    : formatCurrency(0)}
                </Text>
              </View> */}
            </View>

            <View style={styles.attendanceColumn}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.columnHeaderText}>
                  Total Half Days : {data.totalHalfDays}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text>
                  {data.totalHalfDayDeductions
                    ? formatCurrency(data.totalHalfDayDeductions)
                    : formatCurrency(0)}
                </Text>
                {/* <Text style={styles.statValue}>{data.totalHalfDays}</Text> */}
                <Text style={styles.statLabel}></Text>
              </View>
              {/* <View style={styles.deductionValue}>
                <Text>
                  {data.totalHalfDayDeductions
                    ? formatCurrency(data.totalHalfDayDeductions)
                    : formatCurrency(0)}
                </Text>
              </View> */}
            </View>

            <View style={styles.attendanceColumn}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.columnHeaderText}>
                  Total Late IN : {data.totalLateIns}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text>
                  {data.totalLateInDeductions
                    ? formatCurrency(data.totalLateInDeductions)
                    : formatCurrency(0)}
                </Text>
                {/* <Text style={styles.statValue}>{data.totalLateIns}</Text> */}
                <Text style={styles.statLabel}></Text>
              </View>
              {/* <View style={styles.deductionValue}>
                <Text>
                  {data.totalLateInDeductions
                    ? formatCurrency(data.totalLateInDeductions)
                    : formatCurrency(0)}
                </Text>
              </View> */}
            </View>

            <View style={styles.attendanceColumn}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.columnHeaderText}>Total Leave Days</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{totalLeaveDays}</Text>
                <Text style={styles.statLabel}></Text>
              </View>
              {/* <View style={styles.deductionValue}>
                <Text>
                  {"SL: " + (data.leaveTypeCounts?.["Sick Leave"] || 0)}
                  {"\nCL: " + (data.leaveTypeCounts?.["Casual Leave"] || 0)}
                  {"\nAL: " + (data.leaveTypeCounts?.["Annual Leave"] || 0)}
                </Text>
              </View> */}
            </View>
          </View>
        </View>

        {/* Deductions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "24%", textAlign: "center", marginRight: "1%" },
                ]}
              >
                Tax
              </Text>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "24%", textAlign: "center", marginRight: "1%" },
                ]}
              >
                EOBI
              </Text>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "24%", textAlign: "center", marginRight: "1%" },
                ]}
              >
                PF Contribution
              </Text>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "24%", textAlign: "center" },
                ]}
              >
                Attendance Deductions
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {formatCurrency(data.tax)}
              </Text>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {formatCurrency(data.eobi)}
              </Text>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {formatCurrency(data.pfContribution)}
              </Text>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {formatCurrency(totalAttendenceDeductions)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "49%", textAlign: "center", marginRight: "1%" },
                ]}
              >
                Total Deductions
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  {
                    width: "49%",
                    textAlign: "center",
                    backgroundColor: colors.white,
                    marginLeft: "1%",
                  },
                ]}
              >
                {totalDeductionsFormatted}
              </Text>
            </View>
          </View>
        </View>

        {/* Extra Payments Section */}
        {data.extraPayments && data.extraPayments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extra Payments</Text>
            <View style={styles.table}>
              {data.extraPayments.map((payment, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={[styles.tableRowHeader, { width: "10%" }]}>
                    {index + 1}.
                  </Text>
                  <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                    {payment.description}
                  </Text>
                  <Text style={[styles.tableCol, { width: "40%" }]}>
                    {formatCurrency(payment.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Amount Payable Section */}
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.amountPayableHeading}>Amount Payable</Text>
              <Text style={styles.amountPayableData}>
                {formatCurrency(data.amountPayable)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerDivider} />

        <View style={styles.footer}>
          <Text style={{ marginBottom: 6 }}>
            Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S
            Block 2, Karachi
          </Text>
          <Text>
            +92 331 2269643 | contact@martechsol.com | www.martechsol.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SalarySlipPDF;
