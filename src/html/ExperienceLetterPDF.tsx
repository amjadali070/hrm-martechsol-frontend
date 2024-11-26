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

export interface ExperienceLetterProps {
  data: {
    date: string;
    employeeName: string;
    companyName: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    signatoryName: string;
    signatoryTitle: string;
  };
}

const ExperienceLetterPDF: React.FC<ExperienceLetterProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.title}>Experience Letter</Text>
          <Text style={styles.date}>Date: {data.date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TO WHOM IT MAY CONCERN</Text>
        </View>

        <View style={styles.body}>
          <Text>
            This is to certify that <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.employeeName}</Text>, 
            was employed with <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.companyName}</Text> as a <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.jobTitle}</Text> from <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.startDate}</Text> to <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.endDate}</Text>.
          </Text>

          <Text style={{marginTop: 10}}>
            During their time with us, <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.employeeName}</Text> was responsible for managing and delivering key projects, collaborating with cross-functional teams, and ensuring high-quality work. They demonstrated strong technical skills in [specific skills/technologies] and contributed significantly to [specific projects or milestones].
          </Text>

          <Text style={{marginTop: 10}}>
            <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.employeeName}</Text> consistently displayed professionalism, reliability, and the ability to handle challenging tasks efficiently. They played a vital role in driving the success of [specific projects or initiatives], contributing to both the team’s success and the overall objectives of the company. Their commitment to excellence was evident through their consistent performance and innovative problem-solving abilities.
          </Text>

          <Text style={{marginTop: 10}}>
            We wish <Text style={{fontFamily: 'Helvetica-Bold'}}>{data.employeeName}</Text> continued success in their future career and believe they will be a valuable asset in any organization. They leave our company with our highest recommendation, and we are confident that they will excel in any future endeavors.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={{marginTop: 20, fontSize: 12}}>Sincerely,</Text>
          <Text style={{marginTop: 10, fontSize: 12,  fontFamily: 'Helvetica-Bold'}}>{data.signatoryName}</Text>
          <Text style={{marginTop: 10, fontSize: 12,  fontFamily: 'Helvetica-Bold'}}>{data.signatoryTitle}</Text>
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

export default ExperienceLetterPDF;