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
  gunmetal900: "#101928",
  gunmetal500: "#475569",
  platinum200: "#e2e8f0",
  alabaster50: "#f8fafc",
  white: "#FFFFFF",
  emerald600: "#059669",
  emerald50: "#ecfdf5",
  rose600: "#e11d48",
  rose50: "#fff1f2",
  amber600: "#d97706",
  amber50: "#fffbeb",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 20,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.3,
    color: colors.gunmetal900,
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "100%",
    backgroundColor: colors.white,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum200,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
  },
  brandName: {
     fontSize: 10,
     color: colors.gunmetal500,
     textAlign: 'right'
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: colors.gunmetal900,
    textTransform: "uppercase",
  },
  periodBadge: {
    backgroundColor: colors.gunmetal900,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  periodText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  
  // Sections
  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum200,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.gunmetal900,
    textTransform: "uppercase",
  },
  
  // Tables
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoCard: {
     width: "48%",
     backgroundColor: colors.alabaster50,
     borderRadius: 4,
     padding: 8,
     borderWidth: 1,
     borderColor: colors.platinum200,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    color: colors.gunmetal500,
    fontSize: 9,
  },
  value: {
    color: colors.gunmetal900,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  // Financial Table
  finTable: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
  },
  finColumn: {
      width: "48%",
  },
  finHeader: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: colors.gunmetal500,
      marginBottom: 6,
      textTransform: "uppercase",
      borderBottomWidth: 1,
      borderBottomColor: colors.platinum200,
      paddingBottom: 2,
  },
  finRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.platinum200,
      borderStyle: "dashed",
  },
  finRowLast: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
  },
  finLabel: {
      fontSize: 9,
      color: colors.gunmetal500,
  },
  finValue: {
      fontSize: 9,
      color: colors.gunmetal900,
      fontFamily: "Helvetica",
  },
  totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      padding: 6,
      borderRadius: 4,
  },
  earningTotal: {
      backgroundColor: colors.emerald50,
  },
  deductionTotal: {
      backgroundColor: colors.rose50,
  },
  totalLabel: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: colors.gunmetal900,
  },
  totalValueEarnings: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: colors.emerald600,
  },
  totalValueDeductions: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: colors.rose600,
  },

  // Net Pay
  netPayContainer: {
      marginTop: 10,
      backgroundColor: colors.gunmetal900,
      padding: 12,
      borderRadius: 6,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
  },
  netPayLabel: {
      color: colors.white,
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
  },
  netPayValue: {
      color: colors.white,
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
  },

  // Attendance
  attendanceGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
  },
  attBox: {
      width: "23%",
      backgroundColor: colors.alabaster50,
      borderWidth: 1,
      borderColor: colors.platinum200,
      borderRadius: 4,
      padding: 6,
      alignItems: "center",
  },
  attValue: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: colors.gunmetal900,
      marginBottom: 2,
  },
  attLabel: {
      fontSize: 7,
      color: colors.gunmetal500,
      textTransform: "uppercase",
      textAlign: "center",
  },
  deductionText: {
      fontSize: 8,
      color: colors.rose600,
      marginTop: 2,
  },
  
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: colors.platinum200,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: colors.gunmetal500,
    marginBottom: 3,
  }
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
        
        {/* Header */}
        <View style={styles.header}>
            <View style={styles.headerTop}>
                 <Image src={logo} style={styles.logo} />
                 <Text style={styles.brandName}>www.martechsol.com</Text>
            </View>
            <View style={styles.titleRow}>
                 <Text style={styles.title}>Salary Slip</Text>
                 <View style={styles.periodBadge}>
                      <Text style={styles.periodText}>{data.month} {data.year}</Text>
                 </View>
            </View>
        </View>

        {/* Employee Info */}
        <View style={styles.section}>
             <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Employee Details</Text>
             </View>
             <View style={styles.tableContainer}>
                  <View style={styles.infoCard}>
                       <View style={styles.row}>
                           <Text style={styles.label}>Name</Text>
                           <Text style={styles.value}>{data.name}</Text>
                       </View>
                       <View style={styles.row}>
                           <Text style={styles.label}>Designation</Text>
                           <Text style={styles.value}>{data.jobTitle}</Text>
                       </View>
                  </View>
                  <View style={styles.infoCard}>
                       <View style={styles.row}>
                           <Text style={styles.label}>Department</Text>
                           <Text style={styles.value}>{data.department}</Text>
                       </View>
                       <View style={styles.row}>
                           <Text style={styles.label}>Pay Period</Text>
                           <Text style={styles.value}>{data.month} {data.year}</Text>
                       </View>
                  </View>
             </View>
        </View>

        {/* Financial Section */}
        <View style={styles.section}>
             <View style={styles.finTable}>
                  {/* Earnings Column */}
                  <View style={styles.finColumn}>
                       <Text style={styles.finHeader}>Earnings</Text>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>Basic Salary</Text>
                           <Text style={styles.finValue}>{formatCurrency(data.basicSalary)}</Text>
                       </View>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>Medical Allowance</Text>
                           <Text style={styles.finValue}>{formatCurrency(data.medicalAllowance)}</Text>
                       </View>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>Mobile Allowance</Text>
                           <Text style={styles.finValue}>{formatCurrency(data.mobileAllowance)}</Text>
                       </View>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>Fuel Allowance</Text>
                           <Text style={styles.finValue}>{formatCurrency(data.fuelAllowance)}</Text>
                       </View>
                        {data.extraPayments && data.extraPayments.map((payment, index) => (
                           <View style={styles.finRow} key={index}>
                               <Text style={styles.finLabel}>{payment.description}</Text>
                               <Text style={styles.finValue}>{formatCurrency(payment.amount)}</Text>
                           </View>
                        ))}
                       
                       <View style={[styles.totalRow, styles.earningTotal]}>
                            <Text style={styles.totalLabel}>Gross Salary</Text>
                            <Text style={styles.totalValueEarnings}>{formatCurrency(data.grossSalary)}</Text>
                       </View>
                  </View>

                  {/* Deductions Column */}
                  <View style={styles.finColumn}>
                       <Text style={styles.finHeader}>Deductions</Text>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>Income Tax</Text>
                           <Text style={styles.finValue}>{formatCurrency(data.tax)}</Text>
                       </View>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>EOBI</Text>
                           <Text style={styles.finValue}>{formatCurrency(data.eobi)}</Text>
                       </View>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>PF Contribution</Text>
                           <Text style={styles.finValue}>{formatCurrency(data.pfContribution)}</Text>
                       </View>
                       <View style={styles.finRow}>
                           <Text style={styles.finLabel}>Attendance Deductions</Text>
                           <Text style={[styles.finValue, { color: colors.rose600 }]}>{formatCurrency(totalAttendenceDeductions)}</Text>
                       </View>

                       <View style={[styles.totalRow, styles.deductionTotal]}>
                            <Text style={styles.totalLabel}>Total Deductions</Text>
                            <Text style={styles.totalValueDeductions}>{totalDeductionsFormatted}</Text>
                       </View>
                  </View>
             </View>
        </View>

         {/* Net Pay Banner */}
        <View style={styles.netPayContainer}>
             <Text style={styles.netPayLabel}>Net Salary Payable</Text>
             <Text style={styles.netPayValue}>{formatCurrency(data.amountPayable)}</Text>
        </View>

        {/* Attendance Summary */}
        <View style={[styles.section, { marginTop: 20 }]}>
             <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Attendance Overview</Text>
             </View>
             <View style={styles.attendanceGrid}>
                  <View style={styles.attBox}>
                       <Text style={styles.attValue}>{data.totalAbsents || 0}</Text>
                       <Text style={styles.attLabel}>Absents</Text>
                       {data.totalAbsentDeductions && (
                           <Text style={styles.deductionText}>-{formatCurrency(data.totalAbsentDeductions)}</Text>
                       )}
                  </View>
                  <View style={styles.attBox}>
                       <Text style={styles.attValue}>{data.totalLateIns || 0}</Text>
                       <Text style={styles.attLabel}>Late Ins</Text>
                       {data.totalLateInDeductions && (
                           <Text style={styles.deductionText}>-{formatCurrency(data.totalLateInDeductions)}</Text>
                       )}
                  </View>
                  <View style={styles.attBox}>
                       <Text style={styles.attValue}>{data.totalHalfDays || 0}</Text>
                       <Text style={styles.attLabel}>Half Days</Text>
                       {data.totalHalfDayDeductions && (
                           <Text style={styles.deductionText}>-{formatCurrency(data.totalHalfDayDeductions)}</Text>
                       )}
                  </View>
                  <View style={styles.attBox}>
                       <Text style={styles.attValue}>{totalLeaveDays}</Text>
                       <Text style={styles.attLabel}>Leaves Taken</Text>
                  </View>
             </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S
            Block 2, Karachi
          </Text>
          <Text style={styles.footerText}>
            +92 331 2269643 | contact@martechsol.com | www.martechsol.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SalarySlipPDF;
