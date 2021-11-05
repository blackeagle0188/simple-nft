import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🐕 AKITA: 🔥 BurnVendor"
        subTitle="You buy 1 AKITA and we burn 10 AKITA."
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
