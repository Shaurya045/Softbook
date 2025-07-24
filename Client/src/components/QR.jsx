import React, { useContext, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Context } from "../context/Context";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import * as QRCodeGenerator from "qrcode";
import { images } from "../assets/assets";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f8fafc",
    padding: 32,
    width: "100%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  qrContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    height: 350,
    backgroundColor: "#fff",
    border: "2px solid #64748b",
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(30,41,59,0.08)",
    padding: 6,
  },
  qrImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: 12,
  },
  stepsContainer: {
    backgroundColor: "#e0e7ef",
    borderRadius: 12,
    padding: 14,
    width: "100%",
    boxShadow: "0 1px 4px rgba(100,116,139,0.07)",
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 6,
  },
  step: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 3,
    lineHeight: 1.5,
  },
  footer: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});

const MyDocument = ({ profileData, qrCodeDataUrl }) => {
  // Safe access with fallback
  const libraryName = profileData?.libraryName || "Library Name Not Available";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Scan this QR for Attendance</Text>
        <View style={styles.qrContainer}>
          {qrCodeDataUrl && (
            <Image src={qrCodeDataUrl} style={styles.qrImage} />
          )}
        </View>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Steps:</Text>
          <Text style={styles.step}>
            1. Make sure that Location or GPS is enabled on your device.
          </Text>
          <Text style={styles.step}>2. Scan the QR code above.</Text>
          <Text style={styles.step}>
            3. Allow location access for the site that opens.
          </Text>
          <Text style={styles.step}>
            4. Register or sign up using the mobile number registered at this
            library.
          </Text>
          <Text style={styles.step}>
            5. After registering or signing up, log in with your mobile number
            and the password you created.
          </Text>
          <Text style={styles.step}>
            6. After logging in, select the second option on the left side, then
            click "Mark" to record your attendance.
          </Text>
          <Text style={styles.step}>
            7. From the next day onward, just scan the QR code and click "Mark"
            to record your attendance.
          </Text>
        </View>
        <Text style={styles.footer}>{libraryName}</Text>
        <View
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={images.logo}
              style={{ width: "100%", objectFit: "contain" }}
            />
          </View>
          <View
            style={{
              width: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -5,
            }}
          >
            <Image
              src={images.letterLogoBlack}
              style={{
                width: "100%",
                objectFit: "contain",
              }}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};

function QR() {
  const { profileData } = useContext(Context);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  // Safe access with fallbacks
  const libraryName = profileData?.libraryName || "Library_QR";
  const userId = profileData?._id || "unknown";
  const qrValue = `https://sooftbookstudent.vercel.app/${userId}/attendance`;
  const fileName = `${libraryName.replace(/\s+/g, "_")}_QR_Code.pdf`;

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataUrl = await QRCodeGenerator.toDataURL(qrValue, {
          width: 180,
          margin: 2,
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    };

    if (userId !== "unknown") {
      generateQRCode();
    }
  }, [qrValue, userId]);

  return (
    <div className="flex flex-col gap-4 bg-[#374151] rounded-xl p-4 w-full max-w-[95vw] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-[18px] sm:text-[20px] font-semibold">
          QR Code for Student Attendance
        </h2>
        {qrCodeDataUrl ? (
          <PDFDownloadLink
            document={
              <MyDocument
                profileData={profileData}
                qrCodeDataUrl={qrCodeDataUrl}
              />
            }
            fileName={fileName}
          >
            {({ loading }) => (
              <button
                className={`px-3 py-1 rounded text-white text-[15px] mt-2 sm:mt-0 ${
                  loading ? "bg-gray-400" : "bg-[#477CBF] hover:bg-[#3a6ba8]"
                }`}
                disabled={loading}
              >
                {loading ? "Generating PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        ) : (
          <button
            className="px-3 py-1 bg-gray-400 rounded text-white text-[15px] mt-2 sm:mt-0"
            disabled
          >
            {profileData ? "Preparing QR Code..." : "Loading profile data..."}
          </button>
        )}
      </div>

      {profileData && (
        <div className="flex justify-center items-center w-full">
          <QRCode
            className="rounded-xl"
            size={Math.min(300, window.innerWidth * 0.7)}
            value={qrValue}
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "320px",
              minWidth: "120px",
            }}
          />
        </div>
      )}

      {/* {qrCodeDataUrl && (
        <div style={styles.pdfViewer}>
          <PDFViewer width="100%" height="100%">
            <MyDocument
              profileData={profileData}
              qrCodeDataUrl={qrCodeDataUrl}
            />
          </PDFViewer>
        </div>
      )} */}
    </div>
  );
}

export default QR;
