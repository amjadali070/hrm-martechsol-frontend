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

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4b0082',
  },
  body: {
    marginTop: 20,
    lineHeight: 1.6,
    fontSize: 10,
    textAlign: 'justify',
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 8,
    color: '#666',
    borderTop: '1px solid #eee',
    paddingTop: 10,
  },
});

interface EmploymentLetterProps {
  data: {
    date: string;
    name: string;
    position: string;
    department: string;
    startDate: string;
    salary: string;
  };
}

const EmploymentLetterPDF: React.FC<EmploymentLetterProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <Text style={styles.title}>Employment Letter</Text>
        <Text>{data.date}</Text>
      </View>

      {/* Body Section */}
      <View>
        <Text>Dear {data.name},</Text>
        <Text style={styles.body}>
          We are pleased to confirm your appointment as a <strong>{data.position}</strong> in
          the <strong>{data.department}</strong> department, starting from <strong>{data.startDate}</strong>. 
          Your monthly salary will be <strong>{data.salary}</strong>.
        </Text>
        <Text style={styles.body}>
          We are excited to have you join our team and look forward to a
          productive collaboration. If you have any questions or need further clarification, 
          please do not hesitate to contact HR.
        </Text>
        <Text style={[styles.body, { marginTop: 20 }]}>
          Best Regards,
        </Text>
        <Text style={styles.body}>
          <strong>HR Department</strong>
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text>Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S Block 2, Karachi</Text>
        <Text>Phone: +92 21 3432 3242</Text>
        <Text>Email: contact@martechsol.com</Text>
      </View>
    </Page>
  </Document>
);

export default EmploymentLetterPDF;