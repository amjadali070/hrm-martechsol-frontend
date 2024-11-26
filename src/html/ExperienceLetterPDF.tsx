import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../assets/LogoMartechSol.png';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { textAlign: 'center', marginBottom: 20 },
  logo: { width: 120, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#4b0082' },
  body: { marginTop: 20, lineHeight: 1.6, fontSize: 10, textAlign: 'justify' },
  footer: { textAlign: 'center', marginTop: 30, fontSize: 8, color: '#666' },
});

interface ExperienceLetterProps {
  data: {
    date: string;
    name: string;
    position: string;
    department: string;
    startDate: string;
    endDate: string;
  };
}

const ExperienceLetterPDF: React.FC<ExperienceLetterProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <Text style={styles.title}>Experience Letter</Text>
        <Text>{data.date}</Text>
      </View>

      <View>
        <Text>Dear {data.name},</Text>
        <Text style={styles.body}>
          This is to certify that {data.name} worked with us as a <strong>{data.position}</strong> in the
          <strong> {data.department} </strong> department from <strong>{data.startDate}</strong> to
          <strong> {data.endDate}</strong>. During this time, they demonstrated exceptional performance.
        </Text>
        <Text style={styles.body}>We wish them all the best for future endeavors.</Text>
      </View>

      <View style={styles.footer}>
        <Text>Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S Block 2, Karachi</Text>
        <Text>Phone: +92 21 3432 3242</Text>
        <Text>Email: contact@martechsol.com</Text>
      </View>
    </Page>
  </Document>
);

export default ExperienceLetterPDF;