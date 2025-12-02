import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Trash2, Edit, ExternalLink, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';
import { fastAPIClient, KnowledgeDocument, Intent } from '../../utils/fastapi-client';
import { knowledgeAPI, intentAPI } from '../../services/fastapi';
import { useAuth } from '../../contexts/Auth';
import { API_CONFIG } from '../../config/api.js';
import { toast } from 'react-toastify';

// Use KnowledgeDocument interface directly from fastapi-client
type Document = KnowledgeDocument;

// Helper functions
const getFileType = (filePath: string) => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  return extension;
};

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function DocumentManagement() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Upload form state
  const [intents, setIntents] = useState<Intent[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
    fetchIntents();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await knowledgeAPI.getDocuments();
      setDocuments(data);
      
      // Set first document as selected if available
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIntents = async () => {
    try {
      const data = await intentAPI.getIntents();
      setIntents(data);
    } catch (error) {
      console.error('Failed to fetch intents:', error);
      toast.error('Failed to load intents. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile || !user || !selectedIntent) {
      toast.error('Please fill all required fields (file and intent)');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('title', documentTitle || uploadedFile.name.split('.')[0]);
      formData.append('category', documentCategory || 'general');
      formData.append('current_user_id', user.id.toString());

      // Debug logging
      console.log('Upload data:', {
        intend_id: selectedIntent,
        file: uploadedFile.name,
        title: documentTitle || uploadedFile.name.split('.')[0],
        category: documentCategory || 'general',
        current_user_id: user.id.toString()
      });

      await knowledgeAPI.uploadDocument(formData, parseInt(selectedIntent));

      // Reset form and close dialog
      setUploadedFile(null);
      setSelectedIntent('');
      setDocumentTitle('');
      setDocumentCategory('');
      setShowUploadDialog(false);
      
      // Refresh documents list
      await fetchDocuments();
      
      toast.success('Document uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error(`Failed to upload document: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;

    try {
      setDeleting(true);
      await knowledgeAPI.deleteDocument(selectedDoc.document_id);
      
      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.document_id !== selectedDoc.document_id));
      
      // Clear selection
      setSelectedDoc(null);
      setShowDeleteDialog(false);
      
      toast.success('Document deleted successfully!');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (doc: Document) => {
    try {
      // Open document in new tab using view endpoint
      const viewUrl = `${API_CONFIG.FASTAPI_BASE_URL}/knowledge/documents/${doc.document_id}/view`;
      window.open(viewUrl, '_blank');
    } catch (error) {
      console.error('Failed to open document:', error);
      toast.error('Failed to open document. Please try again.');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen h-full flex bg-[#F8FAFC]">
      {/* Left Panel - Document List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Documents</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => {
                setUploadedFile(null);
                setShowUploadDialog(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Upload File
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredDocuments.length} documents found
          </div>
        </div>

        {/* Document List */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading documents...</span>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? `No documents match "${searchQuery}"`
                  : 'No documents have been uploaded yet'
                }
              </p>
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => {
                    setUploadedFile(null);
                    setShowUploadDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Upload First Document
                </Button>
              )}
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No documents found</p>
                  {searchQuery ? (
                    <p className="text-xs mt-1">Try adjusting your search terms</p>
                  ) : (
                    <p className="text-xs mt-1">Upload your first document to get started</p>
                  )}
                </div>
              ) : (
                filteredDocuments.map(doc => (
                  <button
                    key={doc.document_id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                      selectedDoc?.document_id === doc.document_id
                        ? 'bg-[#3B82F6] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.title}</div>
                      <div className={`text-sm truncate ${
                        selectedDoc?.document_id === doc.document_id ? 'text-blue-100' : 'text-muted-foreground'
                      }`}>
                        Updated {formatDate(doc.uploaded_at)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Panel - Document Detail View */}
      <div className="flex-1 flex flex-col">
        {selectedDoc ? (
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">{selectedDoc.title}</h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleView(selectedDoc)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Uploaded</div>
                  <div>{formatDate(selectedDoc.uploaded_at)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">File Type</div>
                  <div className="capitalize">{getFileType(selectedDoc.file_path)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">File Path</div>
                  <div className="text-sm text-muted-foreground truncate">{selectedDoc.file_path}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Document ID</div>
                  <div>{selectedDoc.document_id}</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3>Content Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-muted-foreground">
                    {selectedDoc.content || 'Document content will be displayed here after processing...'}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">No Document Selected</h3>
              <p className="text-sm text-muted-foreground">
                {documents.length === 0 
                  ? 'Upload your first document to get started'
                  : 'Select a document from the list to view its details'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Select a document file and specify its intent for the knowledge base.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Intent Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-600">Intent *</label>
              <Select value={selectedIntent} onValueChange={setSelectedIntent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an intent for this document" />
                </SelectTrigger>
                <SelectContent>
                  {intents.map((intent) => (
                    <SelectItem key={intent.intent_id} value={intent.intent_id.toString()}>
                      {intent.intent_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {intents.length === 0 && (
                <p className="text-xs text-muted-foreground">Loading intents...</p>
              )}
            </div>

            {/* Document Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Title</label>
              <Input
                type="text"
                placeholder="Enter document title (optional)"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use filename as title
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                type="text"
                placeholder="Enter category (optional)"
                value={documentCategory}
                onChange={(e) => setDocumentCategory(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                e.g., FAQ, Guidelines, Procedures (defaults to 'general')
              </p>
            </div>

            {/* File Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-600">Select Document File *</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.html,.xlsx,.pptx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check file size (max 50MB)
                      const maxSize = 50 * 1024 * 1024;
                      if (file.size > maxSize) {
                        toast.error('File size must be less than 50MB');
                        e.target.value = '';
                        return;
                      }
                      
                      setUploadedFile(file);
                      // Auto-fill title if empty
                      if (!documentTitle) {
                        setDocumentTitle(file.name.split('.')[0]);
                      }
                    }
                  }}
                  className="flex-1"
                />
              </div>
              {uploadedFile && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, TXT, HTML, XLSX, PPTX (Max 50MB)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setUploadedFile(null);
              setSelectedIntent('');
              setDocumentTitle('');
              setDocumentCategory('');
              setShowUploadDialog(false);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!uploadedFile || !selectedIntent || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Upload Document'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}