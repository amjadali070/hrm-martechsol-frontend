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
  grayforRows: '#e8e8e8',
  black: '#000000',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 25, 
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom:10,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.2,
    color: colors.gray800,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logo: {
    width: 120,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    marginBottom: 3,
    marginTop: 10,
  },
  date: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 9,
    color: colors.gray600,
    fontStyle: 'italic',
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
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 4,
    backgroundColor: colors.lightGray,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'center',
  },
  tableColHeader: {
    width: '40%',
    padding: 5,
    fontSize: 9,
    color: colors.white,
    backgroundColor: colors.purple900,
  },
  tableRowHeader: {
    width: '40%',
    padding: 6,
    fontSize: 10,
    color: colors.black,
    backgroundColor: colors.grayforRows,
  },
  amountPayableHeading: {
    width: '40%',
    fontFamily: 'Helvetica-Bold',
    padding: 8,
    fontSize: 10,
    color: colors.white,
    backgroundColor: colors.purple900,
  },
  amountPayableData: {
    width: '60%',
    padding: 5,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray800,
  },
  tableCol: {
    width: '60%',
    padding: 5,
    fontSize: 10,
    color: colors.gray800,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
    color: colors.black,
    fontStyle: 'italic',
    lineHeight: 1.2,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.purple900,
    marginTop: 70,
    marginBottom: 10,
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
        <Text style={styles.title}>Salary Slip</Text>
        <Text style={styles.date}>Date: {data.date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Name</Text>
            <Text style={styles.tableCol}>{data.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Designation</Text>
            <Text style={styles.tableCol}>{data.designation}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Job Type</Text>
            <Text style={styles.tableCol}>{data.jobType}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salary Period</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Salary for the month of</Text>
            <Text style={styles.tableCol}>{data.month}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>From</Text>
            <Text style={styles.tableCol}>{data.from}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>To</Text>
            <Text style={styles.tableCol}>{data.to}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salary Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Basic Salary</Text>
            <Text style={styles.tableCol}>{data.basicSalary}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Medical Allowance</Text>
            <Text style={styles.tableCol}>{data.medicalAllowance}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Mobile Allowance</Text>
            <Text style={styles.tableCol}>{data.mobileAllowance}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Fuel Allowance</Text>
            <Text style={styles.tableCol}>{data.fuelAllowance}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Gross Salary</Text>
            <Text style={styles.tableCol}>{data.grossSalary}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deductions</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>Tax</Text>
            <Text style={styles.tableCol}>{data.tax}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>EOBI</Text>
            <Text style={styles.tableCol}>{data.eobi}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableRowHeader, styles.boldText]}>PF Contribution</Text>
            <Text style={styles.tableCol}>{data.pfContribution}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.amountPayableHeading, styles.boldText]}>Amount Payable</Text>
            <Text style={styles.amountPayableData}>{data.amountPayable}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerDivider} />

      <View style={styles.footer}>
        <Text style={{marginBottom:6}}>Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S Block 2, Karachi</Text>
        <Text>+92 331 2269643  |  contact@martechsol.com  |  www.martechsol.com </Text>
      </View>
    </Page>
  </Document>
);

export default SalarySlipPDF;