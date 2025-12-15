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

const colors = {
  gunmetal900: "#101928",
  gunmetal500: "#475569",
  platinum200: "#e2e8f0",
  alabaster50: "#f8fafc",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.gunmetal900,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  content: {
    flexGrow: 1,
    flexDirection: "column",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 140,
    marginBottom: 10,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum200,
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: colors.gunmetal900,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaData: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
    width: "100%",
  },
  date: {
    fontSize: 10,
    color: colors.gunmetal500,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    backgroundColor: colors.gunmetal900,
    color: colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    borderRadius: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: {
    marginTop: 10,
    fontSize: 11,
    textAlign: "justify",
    color: colors.gunmetal900,
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
  paragraph: {
    marginBottom: 12,
    textIndent: 20,
  },
  signature: {
    marginTop: 60,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  signatureName: {
    marginTop: 40,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.gunmetal900,
    borderTopWidth: 1,
    borderTopColor: colors.platinum200,
    paddingTop: 5,
    minWidth: 150,
  },
  signatureTitle: {
    fontSize: 10,
    color: colors.gunmetal500,
    marginTop: 2,
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.platinum200,
    marginBottom: 10,
  },
  footer: {
    textAlign: "center",
    fontSize: 8,
    color: colors.gunmetal500,
    paddingTop: 5,
  },
  footerText: {
    marginBottom: 4,
  },
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Experience Letter</Text>
          </View>
          <View style={styles.metaData}>
            <Text style={styles.date}>Date: {data.date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TO WHOM IT MAY CONCERN</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.paragraph}>
            This is to certify that{" "}
            <Text style={styles.boldText}>{data.employeeName}</Text> was
            employed with{" "}
            <Text style={styles.boldText}>{data.companyName}</Text> as a{" "}
            <Text style={styles.boldText}>{data.jobTitle}</Text> from{" "}
            <Text style={styles.boldText}>{data.startDate}</Text> to{" "}
            <Text style={styles.boldText}>{data.endDate}</Text>.
          </Text>

          <Text style={styles.paragraph}>
            During their time with us,{" "}
            <Text style={styles.boldText}>{data.employeeName}</Text> was
            responsible for managing and delivering key projects, collaborating
            with cross-functional teams, and ensuring high-quality work. They
            demonstrated strong technical skills and contributed significantly
            to our projects.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>{data.employeeName}</Text>{" "}
            consistently displayed professionalism, reliability, and the ability
            to handle challenging tasks efficiently. Their commitment to
            excellence was evident through their consistent performance.
          </Text>

          <Text style={styles.paragraph}>
            We wish <Text style={styles.boldText}>{data.employeeName}</Text>{" "}
            continued success in their future career and believe they will be a
            valuable asset in any organization. They leave our company with our
            highest recommendation.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={{ fontSize: 11, color: colors.gunmetal500 }}>
            Sincerely,
          </Text>
          <Text style={styles.signatureName}>{data.signatoryName}</Text>
          <Text style={styles.signatureTitle}>{data.signatoryTitle}</Text>
        </View>
      </View>

      <View>
        <View style={styles.footerDivider} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S
            Block 2, Karachi
          </Text>
          <Text style={styles.footerText}>
            +92 331 2269643 | contact@nexus.com | www.nexus.com
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ExperienceLetterPDF;
