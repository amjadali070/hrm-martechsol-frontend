// src/components/SalarySlipPDF.tsx
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import logo from '../assets/LogoMartechSol.png';
import backgroundImage from '../assets/v_background.svg';

const colors = {
  purple900: '#581c87',
  white: '#FFFFFF',
  gray600: '#718096',
  gray800: '#2D3748',
  lightGray: '#f3f4f6',
};

const styles = StyleSheet.create({
  page: {
    padding: 10, // Reduced padding to make better use of space
    fontFamily: 'Helvetica',
    fontSize: 9, // Slightly reduced font size for better fit
    lineHeight: 1.2, // Slightly reduced line height for better fit
    color: colors.gray800,
    flexDirection: 'column',
    justifyContent: 'flex-start', // Adjusted to prevent unnecessary spacing
    height: '100%', // Ensure content fits on one page
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: 14, // Adjusted spacing for header
    position: 'relative',
  },
  logo: {
    width: 120,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.purple900,
    marginBottom: 3,
  },
  date: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 8,
    color: colors.gray600,
    fontStyle: 'italic',
  },
  section: {
    marginTop: 10, // Adjusted section margin for better spacing
    marginBottom: 14, // Reduced section margin for compactness
  },
  sectionTitle: {
    backgroundColor: colors.purple900,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 6,
    fontSize: 11, // Adjusted font size for better fit
    fontWeight: 'bold', // Made title bold
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 4,
    padding: 4,
    backgroundColor: colors.lightGray,
    marginBottom: 8, // Reduced space between tables
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 3, // Reduced space between rows
    alignItems: 'center',
  },
  tableColHeader: {
    width: '40%',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 9, // Adjusted font size
    color: colors.white,
    backgroundColor: colors.purple900,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  tableCol: {
    width: '60%',
    padding: 5,
    fontSize: 9, // Adjusted font size
    color: colors.gray800,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 7, // Reduced footer font size
    marginTop: 12, // Adjusted spacing above footer
    color: colors.gray600,
    fontStyle: 'italic',
    lineHeight: 1.2,
  },
  boldText: {
    fontWeight: 'bold', // Added bold text class for important info
  },
  footerDivider: {
    height: 1, // The height of the divider
    backgroundColor: colors.gray600, // Divider color
    marginBottom: 10, // Space below the divider
  },
});

interface SalarySlipPDFProps {
  data: {
    date: string;
    name: string;
    designation: string;
    jobType: string;
    month: string;
    from: string;
    to: string;
    basicSalary: string;
    medicalAllowance: string;
    mobileAllowance: string;
    fuelAllowance: string;
    grossSalary: string;
    tax: string;
    eobi: string;
    pfContribution: string;
    amountPayable: string;
  };
}

const SalarySlipPDF: React.FC<SalarySlipPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <Text style={styles.title}>SALARY SLIP</Text>
        <Text style={styles.date}>Date: {data.date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Name</Text>
            <Text style={styles.tableCol}>{data.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Designation</Text>
            <Text style={styles.tableCol}>{data.designation}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Job Type</Text>
            <Text style={styles.tableCol}>{data.jobType}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salary Period</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Salary for the month of</Text>
            <Text style={styles.tableCol}>{data.month}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>From</Text>
            <Text style={styles.tableCol}>{data.from}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>To</Text>
            <Text style={styles.tableCol}>{data.to}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salary Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Basic Salary</Text>
            <Text style={styles.tableCol}>{data.basicSalary}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Medical Allowance</Text>
            <Text style={styles.tableCol}>{data.medicalAllowance}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Mobile Allowance</Text>
            <Text style={styles.tableCol}>{data.mobileAllowance}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Fuel Allowance</Text>
            <Text style={styles.tableCol}>{data.fuelAllowance}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Gross Salary</Text>
            <Text style={styles.tableCol}>{data.grossSalary}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deductions</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Tax</Text>
            <Text style={styles.tableCol}>{data.tax}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>EOBI</Text>
            <Text style={styles.tableCol}>{data.eobi}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>PF Contribution</Text>
            <Text style={styles.tableCol}>{data.pfContribution}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount Payable</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.boldText]}>Amount Payable</Text>
            <Text style={styles.tableCol}>{data.amountPayable}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerDivider} />

      <View style={styles.footer}>
        <Text>Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S Block 2, Karachi</Text>
        <Text>Phone: +92 21 3432 3242</Text>
        <Text>Email: contact@martechsol.com</Text>
      </View>
    </Page>
  </Document>
);

export default SalarySlipPDF;