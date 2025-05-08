import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
} from "@react-email/components";
import config from "@/config";

interface EmailTemplateProps {
  email: string;
  otp: string;
}

export const OTPEmailTemplate = ({ email, otp }: EmailTemplateProps) => (
  <Html>
    <Head>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');`}
      </style>
    </Head>
    <Preview>Your OTP for {config.appName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading as="h1" style={heading}>
          Welcome, {email}!
        </Heading>
        <Text style={text}>
          Here is your OTP for <strong>{config.appName}</strong>:{" "}
          <strong>{otp}</strong>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  padding: "20px",
  fontFamily: "'Ubuntu', sans-serif",
};

const container = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "16px",
  fontFamily: "'Ubuntu', sans-serif",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.5",
  fontFamily: "'Ubuntu', sans-serif",
};

export default OTPEmailTemplate;
