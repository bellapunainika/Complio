import React, { useState } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  FileText, 
  FileSpreadsheet, 
  Receipt, 
  FileJson, 
  Building, 
  Calendar, 
  Clock, 
  Info,
  ExternalLink
} from 'lucide-react';
import { DocumentCategory } from '../types';

export const DocumentVaultPage: React.FC = () => {
  const { vaultDocuments, deleteVaultDocument, currentProfile } = useCompliance();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: DocumentCategory[] = [
    'GST Reports',
    'Invoices',
    'Credit Notes',
    'Agreements',
    'Other Compliance Documents'
  ];

  const filteredDocs = vaultDocuments.filter((doc) => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.associatedBusiness.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'CSV':
      case 'XLSX':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'JSON':
        return <FileJson className="w-5 h-5 text-[#6C8FFF]" />;
      default:
        return <FileText className="w-5 h-5 text-[#9466FF]" />;
    }
  };

  const handleSimulatedDownload = (docTitle: string) => {
    alert(`Downloading ${docTitle} from browser local store.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-center gap-2.5">
            <FolderArchive className="w-7 h-7 text-[#9466FF]" />
            <span>Document Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9295A5] mt-1">
            Centralized local repository of generated GST reconciliation reports, tax invoices, and legal agreements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9295A5]">Total Saved:</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#12151D] border border-white/10 text-xs font-bold text-white">
            {vaultDocuments.length} Documents
          </span>
        </div>
      </div>

      {/* Storage Architecture Callout */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#9295A5] flex items-center gap-3">
        <Info className="w-4 h-4 text-[#9466FF] shrink-0" />
        <span>
          <strong>Storage Architecture:</strong> Document metadata and audit logs are saved locally in your browser's localStorage. Downloaded PDF/CSV artifacts are stored directly on your laptop's filesystem.
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-t-xl font-medium whitespace-nowrap transition-all border-b-2 ${
            selectedCategory === 'all'
              ? 'border-[#9466FF] text-white bg-white/[0.04]'
              : 'border-transparent text-[#9295A5] hover:text-white'
          }`}
        >
          All Vault Items ({vaultDocuments.length})
        </button>

        {categories.map((cat) => {
          const count = vaultDocuments.filter(d => d.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-t-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border-b-2 ${
                isActive
                  ? 'border-[#9466FF] text-white bg-white/[0.04]'
                  : 'border-transparent text-[#9295A5] hover:text-white'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-[#9466FF]/20 text-[#B69AFF]' : 'bg-white/5 text-[#9295A5]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#9295A5] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by document title or entity..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#12151D] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#9466FF]"
        />
      </div>

      {/* Documents Grid / Table */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 sm:p-5 rounded-2xl bg-[#0D0F15] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-[#12151D] border border-white/5 shrink-0">
                {getFileIcon(doc.fileType)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-white text-sm hover:text-[#B69AFF] transition-colors">
                    {doc.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono">
                    {doc.fileType}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#9466FF]/15 text-[#B69AFF]">
                    {doc.category}
                  </span>
                </div>

                <p className="text-xs text-[#9295A5]">
                  {doc.dataSummary || 'Verified statutory preparation artifact'}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-[#9295A5] pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#9466FF]" />
                    {doc.generatedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#6C8FFF]" />
                    {doc.associatedBusiness}
                  </span>
                  <span>Size: {doc.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleSimulatedDownload(doc.title)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#B69AFF]" />
                <span>Download</span>
              </button>

              <button
                onClick={() => deleteVaultDocument(doc.id)}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete from Vault"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0D0F15] border border-white/5 space-y-2">
            <FolderArchive className="w-8 h-8 text-[#9295A5] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white">No documents found</h3>
            <p className="text-xs text-[#9295A5]">
              Generate a GST preparation report or invoice from the Document Studio to populate this vault.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

