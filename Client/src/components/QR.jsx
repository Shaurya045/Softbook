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

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    height: "100%",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
  },
  qrContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    width: "400px",
    height: "400px",
  },
});

const MyDocument = ({ profileData, qrCodeDataUrl }) => {
  // Safe access with fallback
  const libraryName = profileData?.libraryName || "Library Name Not Available";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Text style={styles.text}>Scan this QR for Attendance</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <View style={styles.qrContainer}>
              {qrCodeDataUrl && (
                <Image src={qrCodeDataUrl} style={styles.qrImage} />
              )}
            </View>
          </View>
          <Text style={styles.text}>{libraryName}</Text>
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
