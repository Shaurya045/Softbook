import React from "react";
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
const MyDocument = ({ data, image }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;

  // Calculate due date (1 month from now)
  const dueDate = new Date(today);
  dueDate.setMonth(dueDate.getMonth() + 1);
  const dueDateFormatted = `${String(dueDate.getDate()).padStart(
    2,
    "0"
  )}/${String(dueDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${dueDate.getFullYear()}`;

  // Format the due date from props if it exists
  const formatDueDate = (dateString) => {
    if (!dateString) return dueDateFormatted;

    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const finalDueDate = formatDueDate(data.dueDate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image src={images.logo} style={{ width: 100 }} />
            <View style={{display: "flex", flexDirection: "column", marginLeft: -10}}>
              <Text style={styles.libraryName}>PRATAP LIBRARY</Text>
              <Text style={styles.subHeader}>A SELF STUDY CENTER</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              marginTop: -30,
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
                H. No.-34-A, Singh Villa, Road No.- 19, (Near Noble Public
                School),
              </Text>
            </View>
            <Text style={styles.addressText}>
              Bank Colony, Baba Chowk, Keshri Nagar, Patna-800024
            </Text>
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
              <Text style={styles.addressText}>9304161888, 9835491795</Text>
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
                <Text style={styles.infoValue}>{data.studentName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Father's Name : </Text>
                <Text style={styles.infoValue}>{data.fatherName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Phone No. : </Text>
                <Text style={styles.infoValue}>{data.phone}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Shift : </Text>
                <Text style={styles.infoValue}>{data.shift}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Seat No. : </Text>
                <Text style={styles.infoValue}>{data.seat}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>ID Proof : </Text>
                <Text style={styles.infoValue}>{data.idProof}</Text>
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

            {image && (
              <View style={styles.photoContainer}>
                <View style={styles.photoFrame}>
                  <Image
                    src={URL.createObjectURL(image)}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 8,
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
              {data.localAddress}
            </Text>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.infoLabel}>Permanent Address : </Text>
            <Text style={{ fontSize: 12, fontWeight: "normal" }}>
              {data.permanentAddress}
            </Text>
          </View>
          <View style={styles.paymentContainer}>
            <View style={styles.paymentItem}>
              <Text style={styles.infoLabel}>Due Date : </Text>
              <Text style={styles.paymentText}>{finalDueDate}</Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.infoLabel}>Amount : </Text>
              <Text style={styles.paymentText}>Rs. {data.amount}</Text>
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
                9304161888/9835491795.
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

function PDF2({ data, image, setShowPDF }) {
  const studentName = data.studentName;
  const phone = 91 + data.phone;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;

  const fileName = `${studentName}_${formattedDate.replace(/\//g, "-")}.pdf`;

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex w-[150px] bg-[#539486] text-white p-[10px] rounded-[10px] mb-[30px] items-center gap-[10px] cursor-pointer hover:scale-[1.1] transition duration-300 self-start ml-[20px] lg:ml-[30px] shadow-[#539486] shadow-lg ">
        <IoArrowBack size={16} />
        <button
          onClick={() => setShowPDF(false)}
          className="text-[16px] font-semibold"
        >
          Back to Form
        </button>
      </div>
      <div className="w-full max-w-[1200px] px-[10px] sm:px-[20px] mb-5">
        <h2 className="text-xl font-bold mb-4 text-center text-[#539486]">
          PDF Preview
        </h2>
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] mb-[20px] rounded-[8px] overflow-hidden border-[2px] border-[#539486] ">
          <PDFViewer width="100%" height="100%">
            <MyDocument data={data} image={image} />
          </PDFViewer>
        </div>
      </div>

      <div className="mt-[0px] flex flex-col sm:flex-row items-center justify-center gap-[20px]">
        <PDFDownloadLink
          document={<MyDocument data={data} image={image} />}
          fileName={fileName}
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className="w-[150px] bg-[#539486] text-white p-[10px] rounded-[10px] text-[21px] font-semibold cursor-pointer hover:scale-[1.1] transition duration-300 shadow-[#539486] shadow-lg"
            >
              {loading ? "Preparing PDF..." : "Print PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <a
          href={`https://wa.me/${phone}?text=Here is your receipt `}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex bg-[#539486] text-white p-[10px] rounded-[10px] gap-[10px] hover:scale-[1.1] transition duration-300 shadow-[#539486] shadow-lg ">
            <div className="w-[30px] h-[30px] bg-green-400 rounded-[50%] flex flex-row justify-center items-center text-[45px] text-white ">
              <FaWhatsapp />
            </div>
            <p className="text-[18px] font-semibold">Send on Whatsapp</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default PDF2;
