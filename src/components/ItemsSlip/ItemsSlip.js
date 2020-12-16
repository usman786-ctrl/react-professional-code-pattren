import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import React from "react";
import { getName } from "../../config/util";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 5,
  },
  textBold: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "bold",
  },
  text: {
    fontFamily: "Open Sans",
    fontSize: 10,
    fontWeight: "normal",
  },
});

// Create Document Component
const ItemsSlip = ({
  ShipmentLine = [],
  BillToAddress = {},
  OrderNo = "",
  pdfOwenerDetail = {},
  name = "Shipping Slip",
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          padding: 15,
        }}
      >
        <View>
          <Text style={styles.textBold}>
            {pdfOwenerDetail.OrganizationName}
          </Text>
          <Text style={styles.text}>
            {pdfOwenerDetail.CorporatePersonInfo?.AddressLine1}
          </Text>
          <Text style={styles.text}>
            {pdfOwenerDetail.CorporatePersonInfo?.AddressLine2}
          </Text>
        </View>
        <View>
          <Text style={styles.textBold}>Date: {moment().format("L")}</Text>
          <Text style={styles.textBold}>Ship To:</Text>
          <Text style={styles.text}>{BillToAddress.AddressLine1}</Text>
          <Text style={styles.text}>{BillToAddress.AddressLine2}</Text>
        </View>
      </View>
      <View style={{ borderBottom: 3, paddingBottom: 12 }}>
        <Text
          style={{
            fontFamily: "Open Sans",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {name}
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          padding: 15,
        }}
      >
        <View>
          <Text style={styles.textBold}>Order: {OrderNo}</Text>
        </View>
        <View>
          <Text style={styles.textBold}>
            Customer: {getName(BillToAddress)}
          </Text>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          padding: 7,
          backgroundColor: "#3f7cb5",
          color: "#fff",
        }}
      >
        <View style={{ minWidth: 50 }}>
          <Text style={styles.textBold}>Line</Text>
        </View>
        <View style={{ flexGrow: 1 }}>
          <Text style={styles.textBold}>Item Description</Text>
        </View>
        <View style={{ minWidth: 70 }}>
          <Text style={styles.textBold}>Quantity</Text>
        </View>
      </View>

      {ShipmentLine.map((dt, idx) => (
        <View
          key={dt.ShipmentLineNo}
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            padding: 7,
            backgroundColor: idx % 2 === 0 ? "#ccc" : "#fff",
          }}
        >
          <View style={{ minWidth: 50, paddingLeft: 5 }}>
            <Text style={styles.textBold}>{dt.ShipmentLineNo}</Text>
          </View>
          <View style={{ flexGrow: 1, maxWidth: "80%" }}>
            <Text style={[styles.textBold]}>{dt.ItemDesc}</Text>
          </View>
          <View style={{ minWidth: 50, paddingLeft: 20 }}>
            <Text style={[styles.textBold]}>
              {dt.Quantity - dt.ShortageQty}
            </Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default ItemsSlip;
