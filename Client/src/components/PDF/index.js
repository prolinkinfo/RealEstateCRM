import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Hello World</Text>
        <Text style={styles.text}>
          This is an example of a simple PDF document created using @react-pdf/renderer.
        </Text>
        <Text style={styles.text}>
          You can add more text, images, and other elements to your PDF document.
        </Text>
      </View>
    </Page>
  </Document>
);


export default MyDocument;
