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

const colors = {
  black: '#000000',
  white: '#FFFFFF',
  gray600: '#6B7280',
  gray800: '#1F2937',
  purple900: '#4C1D95',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 25, 
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 10,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.2,
    color: colors.gray800,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  content: {
    flexGrow: 1,
    flexDirection: 'column',
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
    marginBottom: 20,
    marginTop: 40,
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
  body: {
    marginTop: 10,
    lineHeight: 1.8,
    fontSize: 12,
    textAlign: 'justify',
  },
  signature: {
    marginTop: 50,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.purple900,
    marginBottom: 10,
  },
  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: colors.black,
    paddingTop: 10,
    paddingBottom: 10,
  },
  footerText: {
    marginBottom: 6,
    fontSize: 12,
  }
});

export interface EmploymentCertificateProps {
  data: {
    date: string;
    employeeName: string;
    companyName: string;
    jobTitle: string;
    startDate: string;
    signatoryName: string;
    signatoryTitle: string;
  };
}

const EmploymentCertificatePDF: React.FC<EmploymentCertificateProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.title}>Employment Letter</Text>
          <Text style={styles.date}>Date: {data.date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TO WHOM IT MAY CONCERN</Text>
        </View>

        <View style={styles.body}>
          <Text>
            This is to certify that <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.employeeName}</Text>, 
            has been employed with <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.companyName}</Text> as a <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.jobTitle}</Text> from <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.startDate} to Present.</Text> 
          </Text>

          <Text style={{marginTop: 10}}>
            During their tenure, <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.employeeName}</Text> was diligent, professional, 
            and contributed significantly to the success of the organization.
          </Text>

          <Text style={{marginTop: 10}}>
            We wish them the best in their future endeavors.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={{marginTop: 20, fontSize: 12}}>Sincerely,</Text>
          <Text style={{marginTop: 10, fontSize: 12,  fontFamily: 'Helvetica-Bold'}}>{data.signatoryName}</Text>
          <Text style={{marginTop: 10, fontSize: 12,  fontFamily: 'Helvetica-Bold'}}>{data.signatoryTitle}</Text>
          {/* <View style={styles.signatureLine}></View> */}
        </View>
      </View>

      <View>
        <View style={styles.footerDivider} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S Block 2, Karachi</Text>
          <Text style={styles.footerText}>+92 331 2269643  |  contact@martechsol.com  |  www.martechsol.com</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default EmploymentCertificatePDF;