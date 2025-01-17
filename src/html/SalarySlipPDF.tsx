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
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 10,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "column",
  },
  logo: {
    width: 120,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    marginBottom: 3,
  },
  headerRight: {
    textAlign: "right",
  },
  date: {
    fontSize: 9,
    color: colors.gray600,
    fontStyle: "italic",
  },
  section: {
    marginTop: 5,
    marginBottom: 5,
  },
  sectionTitle: {
    backgroundColor: colors.purple900,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 11,
    textAlign: "center",
    marginBottom: 4,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 4,
    backgroundColor: colors.lightGray,
    marginBottom: 8,
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
  },
  tableCol: {
    fontSize: 10,
    color: colors.gray800,
    padding: 5,
  },
  amountPayableHeading: {
    fontFamily: "Helvetica-Bold",
    padding: 8,
    fontSize: 10,
    color: colors.white,
    backgroundColor: colors.purple900,
    width: "40%",
  },
  amountPayableData: {
    padding: 5,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.gray800,
    width: "60%",
  },
  // Styles for Absent Dates boxes:
  absentDatesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  absentDateBox: {
    backgroundColor: colors.grayforRows,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  absentDateText: {
    fontSize: 9,
    color: colors.black,
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
});

// Helper function to convert a currency-formatted string to a number
const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^0-9.-]+/g, ""));
};

interface SalarySlipPDFProps {
  data: {
    date: string;
    name: string;
    designation: string;
    jobType: string;
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
    absentDeductions?: string; // New field for absent deductions
    amountPayable: string;
    allowances?: string;
    extraPayments?: { description: string; amount: string }[];
    absentDates?: string[]; // ISO strings; will be formatted in the PDF
    leaveDetails?: {
      casualLeaveAvailable?: string;
      sickLeaveAvailable?: string;
      annualLeaveAvailable?: string;
    };
  };
}

const SalarySlipPDF: React.FC<SalarySlipPDFProps> = ({ data }) => {
  // Calculate total deductions from the four fields.
  const totalDeductionsNumber =
    parseCurrency(data.tax) +
    parseCurrency(data.eobi) +
    parseCurrency(data.pfContribution) +
    parseCurrency(data.absentDeductions || "PKR 0");

  const totalDeductionsFormatted =
    "PKR " +
    totalDeductionsNumber.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Salary Slip and Month/Year */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={logo} style={styles.logo} />
            <Text style={styles.title}>Salary Slip</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 10, color: colors.gray600 }}>
              {data.month} {data.year}
            </Text>
            <Text style={styles.date}>Date: {data.date}</Text>
          </View>
        </View>

        {/* Personal Details Section */}
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
                Designation
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.designation}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Job Type
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.jobType}
              </Text>
            </View>
          </View>
        </View>

        {/* Salary Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Basic Salary
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.basicSalary}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Medical Allowance
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.medicalAllowance}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Mobile Allowance
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.mobileAllowance}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Fuel Allowance
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.fuelAllowance}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                Gross Salary
              </Text>
              <Text style={[styles.tableCol, { width: "60%" }]}>
                {data.grossSalary}
              </Text>
            </View>
          </View>
        </View>

        {/* Deductions Section: All deductions rendered in the same row with an extra row for total */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "25%", textAlign: "center" },
                ]}
              >
                Tax
              </Text>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "25%", textAlign: "center" },
                ]}
              >
                EOBI
              </Text>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "25%", textAlign: "center" },
                ]}
              >
                PF Contribution
              </Text>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "25%", textAlign: "center" },
                ]}
              >
                Absent Deductions
              </Text>
            </View>
            {/* Values Row */}
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {data.tax}
              </Text>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {data.eobi}
              </Text>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {data.pfContribution}
              </Text>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                {data.absentDeductions || "PKR 0"}
              </Text>
            </View>
            {/* Total Deductions Row */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableRowHeader,
                  { width: "66.66%", textAlign: "center" },
                ]}
              >
                Total Deductions
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  { width: "33.33%", textAlign: "center" },
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
                  <Text style={[styles.tableRowHeader, { width: "30%" }]}>
                    {index + 1}.
                  </Text>
                  <Text style={[styles.tableCol, { width: "40%" }]}>
                    {payment.description}
                  </Text>
                  <Text style={[styles.tableCol, { width: "30%" }]}>
                    {payment.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Absent Dates Section */}
        {data.absentDates && data.absentDates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Absent Dates</Text>
            <View style={styles.absentDatesContainer}>
              {data.absentDates.map((dateStr, index) => {
                const formattedDate = new Date(dateStr).toLocaleDateString();
                return (
                  <View style={styles.absentDateBox} key={index}>
                    <Text style={styles.absentDateText}>{formattedDate}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Leave Details Section */}
        {data.leaveDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leave Details</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                  Casual Leave
                </Text>
                <Text style={[styles.tableCol, { width: "60%" }]}>
                  {data.leaveDetails.casualLeaveAvailable || 0}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                  Sick Leave
                </Text>
                <Text style={[styles.tableCol, { width: "60%" }]}>
                  {data.leaveDetails.sickLeaveAvailable || 0}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableRowHeader, { width: "40%" }]}>
                  Annual Leave
                </Text>
                <Text style={[styles.tableCol, { width: "60%" }]}>
                  {data.leaveDetails.annualLeaveAvailable || 0}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Amount Payable Section */}
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.amountPayableHeading}>Amount Payable</Text>
              <Text style={styles.amountPayableData}>{data.amountPayable}</Text>
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
