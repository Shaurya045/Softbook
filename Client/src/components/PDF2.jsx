import React, { useContext } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { images } from "../assets/assets";
import { FaWhatsapp } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import { Context } from "../context/Context";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginTop: -10,
    marginBottom: 10,
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  libraryName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#539486",
  },
  subHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#539486",
  },
  addressText: {
    fontSize: 10,
    color: "#539486",
    fontWeight: "medium",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#539486",
    marginTop: -20,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "medium",
    color: "#539486",
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "semibold",
  },
  studentInfo: {
    marginTop: -10,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 21,
    width: "100%",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    backgroundColor: "rgba(83, 148, 134, 0.05)",
    padding: 13,
    borderRadius: 8,
    width: "100%",
  },
  infoItem: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "medium",
    color: "#539486",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "normal",
  },
  addressContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "rgba(83, 148, 134, 0.05)",
    padding: 13,
    borderRadius: 8,
  },
  paymentContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    width: "100%",
  },
  paymentItem: {
    backgroundColor: "rgba(83, 148, 134, 0.1)",
    padding: 13,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#539486",
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  paymentText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#539486",
    textAlign: "center",
    marginBottom: 14,
  },
  rulesContainer: {
    backgroundColor: "rgba(83, 148, 134, 0.05)",
    padding: 13,
    borderRadius: 8,
    gap: 8,
    width: "100%",
  },
  ruleItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ruleText: {
    fontSize: 11,
  },
  photoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "flex-start",
    width: "17%",
  },
  photoFrame: {
    width: 80,
    height: 100,
    backgroundColor: "rgba(83, 148, 134, 0.1)",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#539486",
    marginBottom: 5,
  },
  photoLabel: {
    fontSize: 8,
    color: "#539486",
    fontWeight: "medium",
  },
  buttonContainer: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  printButton: {
    width: 150,
    backgroundColor: "#539486",
    color: "#ffffff",
    padding: 10,
    borderRadius: 10,
    fontSize: 21,
    fontWeight: "semibold",
  },
  whatsappButton: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#539486",
    color: "#ffffff",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  mobileWarning: {
    color: "red",
    fontWeight: "bold",
    fontSize: 24,
  },
  backButton: {
    width: 150,
    backgroundColor: "#539486",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 30,
    alignSelf: "flex-start",
    marginLeft: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

// Create Document Component
const MyDocument = ({ studentData, profileData }) => {
  // Use toLocaleDateString for formatting dates simply
  const today = new Date(studentData.createdAt);
  const formattedDate = today.toLocaleDateString("en-GB");

  // Format the due date from props if it exists
  const formatDueDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const finalDueDate = formatDueDate(studentData.dueDate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* <Image src={images.logo} style={{ width: 100 }} /> */}
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                // marginLeft: -10,
              }}
            >
              <Text style={styles.libraryName}>
                {profileData.libraryName.toUpperCase()}
              </Text>
              {/* <Text style={styles.subHeader}>A SELF STUDY CENTER</Text> */}
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              // marginTop: -30,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Image src={images.map} style={{ width: 10, height: 10 }} />
              <Text style={styles.addressText}>
                {profileData.address
                  ? profileData.address
                  : "Patna, Bihar, India"}
              </Text>
            </View>
            {/* <Text style={styles.addressText}>
              Bank Colony, Baba Chowk, Keshri Nagar, Patna-800024
            </Text> */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Image src={images.phone} style={{ width: 10, height: 10 }} />
              <Text style={styles.addressText}>{profileData.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date : </Text>
          <Text style={styles.dateValue}>{formattedDate}</Text>
        </View>

        {/* Student Info */}
        <View style={styles.studentInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Student's Name : </Text>
                <Text style={styles.infoValue}>{studentData.studentName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Father's Name : </Text>
                <Text style={styles.infoValue}>{studentData.fatherName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Phone No. : </Text>
                <Text style={styles.infoValue}>{studentData.phone}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Shift : </Text>
                <Text style={styles.infoValue}>{studentData.shift}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Seat No. : </Text>
                <Text style={styles.infoValue}>
                  {studentData.room + " - " + studentData.seatNo}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>ID Proof : </Text>
                <Text style={styles.infoValue}>{studentData.idProof}</Text>
              </View>
            </View>

            {/* <View style={styles.photoContainer}>
              <View style={styles.photoFrame}>
                <Image
                  src={images.upload}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              </View>
              <Text style={styles.photoLabel}>Student Photo</Text>
            </View> */}

            {studentData.image && (
              <View style={styles.photoContainer}>
                <View style={styles.photoFrame}>
                  <Image
                    src={studentData.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 5,
                      objectFit: "cover",
                    }}
                  />
                </View>
                <Text style={styles.photoLabel}>Student Photo</Text>
              </View>
            )}
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.infoLabel}>Local Address : </Text>
            <Text style={{ fontSize: 12, fontWeight: "normal" }}>
              {studentData.localAdd}
            </Text>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.infoLabel}>Permanent Address : </Text>
            <Text style={{ fontSize: 12, fontWeight: "normal" }}>
              {studentData.permanentAdd}
            </Text>
          </View>
          <View style={styles.paymentContainer}>
            <View style={styles.paymentItem}>
              <Text style={styles.infoLabel}>Due Date : </Text>
              <Text style={styles.paymentText}>{finalDueDate}</Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.infoLabel}>Amount : </Text>
              <Text style={styles.paymentText}>Rs. {studentData.amount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Rules */}
        <View style={{ alignSelf: "flex-start", width: "100%" }}>
          <Text style={styles.sectionTitle}>Rules & Regulations</Text>
          <View style={styles.rulesContainer}>
            <View style={styles.ruleItem}>
              <Image src={images.check} style={{ width: 10, height: 10 }} />
              <Text style={styles.ruleText}>
                Please maintain silence in the library.
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Image src={images.check} style={{ width: 10, height: 10 }} />
              <Text style={styles.ruleText}>
                Mark your attendance daily in the register.
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Image src={images.check} style={{ width: 10, height: 10 }} />
              <Text style={styles.ruleText}>
                Always flush after using washroom.
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Image src={images.check} style={{ width: 10, height: 10 }} />
              <Text style={styles.ruleText}>
                For any complaints/suggestions contact on this no.
                {profileData.phone}.
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#539486",
          }}
        />

        {/* Don'ts */}
        <View style={{ alignSelf: "flex-start", width: "100%" }}>
          <Text style={styles.sectionTitle}>Don'ts</Text>
          <View style={styles.rulesContainer}>
            <View style={styles.ruleItem}>
              <Image src={images.cancel} style={{ width: 10, height: 10 }} />
              <Text style={styles.ruleText}>
                No discussions/murmurning inside the library.
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Image src={images.cancel} style={{ width: 10, height: 10 }} />
              <Text style={styles.ruleText}>
                No food items are allowed to have on the seat.
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Image src={images.cancel} style={{ width: 10, height: 10 }} />
              <Text style={styles.ruleText}>
                Don't gather in groups outside the library. (Strictly
                Prohibited)
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

function PDF2({ studentData }) {
  const { profileData } = useContext(Context);

  if (!studentData || !studentData.studentName) {
    return (
      <div className="flex flex-col w-full justify-center items-center gap-9 ">
        <h1 className="text-[30px] font-semibold text-red-500 ">
          PDF Data Error
        </h1>
        <p className="text-lg text-gray-700">
          Student data is missing or incomplete.
        </p>
        {/* <button
          onClick={() => setShowPDF(false)}
          className="bg-[#4BDE80] text-[#101826] p-[10px] rounded-[10px] font-semibold mt-4"
        >
          Back to Form
        </button> */}
      </div>
    );
  }

  const studentName = studentData.studentName;
  const phone = 91 + studentData.phone;
  const today = new Date(studentData.createdAt);
  const formattedDate = today.toLocaleDateString("en-GB");

  const fileName = `${studentName}_${formattedDate.replace(/\//g, "-")}.pdf`;

  return (
    <div className="flex flex-col w-full justify-center items-start gap-5 sm:gap-9 ">
      <div className="w-full max-w-[1200px] ">
        <h2 className="text-xl font-bold mb-4 text-center text-[#757C89]">
          PDF Preview
        </h2>
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] mb-[20px] rounded-[8px] overflow-hidden border-[2px] border-[#757C89] ">
          <PDFViewer width="100%" height="100%">
            <MyDocument studentData={studentData} profileData={profileData} />
          </PDFViewer>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-6 sm:gap-[60px]">
        <div className="w-full sm:w-[300px] max-w-[400px] flex">
          <PDFDownloadLink
            document={
              <MyDocument studentData={studentData} profileData={profileData} />
            }
            fileName={fileName}
            className="w-full"
          >
            {({ loading }) => (
              <button
                disabled={loading}
                className="w-full bg-[#374151] text-white p-[10px] rounded-[10px] text-[18px] sm:text-[21px] font-semibold cursor-pointer hover:scale-[1.05] sm:hover:scale-[1.1] transition duration-300"
                style={{ minWidth: 0 }}
              >
                {loading ? "Preparing PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
        <div className="w-full sm:w-[300px] max-w-[400px] flex">
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(
              `Hello ${studentData.studentName},
Your seat booking at *${profileData.libraryName}* is confirmed.

*Date:* ${formattedDate}
*Room:* ${studentData.room}
*Seat:* ${studentData.seatNo}
*Shift:* ${studentData.shift}

Thank you!
Regards,
${profileData.libraryName}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <div className="flex items-center justify-center w-full bg-[#4BDE80] text-white p-[10px] rounded-[10px] gap-[10px] hover:scale-[1.05] sm:hover:scale-[1.1] transition duration-300">
              <FaWhatsapp size={24} className="sm:size-[30px]" />
              <p className="text-[16px] sm:text-[18px] font-semibold">
                Send on Whatsapp
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default PDF2;
