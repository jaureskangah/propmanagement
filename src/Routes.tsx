
import React from "react";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import TenantList from "./pages/TenantList";
import DocumentGenerator from "./pages/DocumentGenerator";
import DocumentHistory from "./pages/DocumentHistory";

const Routes: React.FC = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<TenantList />} />
      <Route path="/tenants" element={<TenantList />} />
      <Route path="/documents/generator" element={<DocumentGenerator />} />
      <Route path="/documents/history" element={<DocumentHistory />} />
    </ReactRoutes>
  );
};

export default Routes;
