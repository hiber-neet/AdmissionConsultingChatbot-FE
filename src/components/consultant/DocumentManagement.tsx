import { useState } from 'react';
import { Search, Plus, FileText, Trash2, Edit, ExternalLink } from 'lucide-react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';

interface Document {
  id: number;
  title: string;
  content: string;
  lastUpdated: string;
  fileType: 'pdf' | 'doc' | 'txt';
  fileSize: string;
  author: string;
}

const documents: Document[] = [
  {
    id: 1,
    title: 'Admission Requirements Guide 2025',
    content: 'Comprehensive guide to admission requirements...',
    lastUpdated: '2024-10-15',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    author: 'Admissions Office'
  },
  {
    id: 2,
    title: 'Financial Aid Handbook',
    content: 'Complete information about financial aid options...',
    lastUpdated: '2024-10-10',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    author: 'Financial Aid Office'
  },
  {
    id: 3,
    title: 'International Student Guide',
    content: 'Information for international applicants...',
    lastUpdated: '2024-09-28',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    author: 'International Office'
  }
];



// Temporary role check - replace with actual role check from your auth system
const isConsultantLeader = false; // Set to true to test leader functionality

export function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDraftConfirmation, setShowDraftConfirmation] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
                setEditedTitle('');
                setUploadedFile(null);
                setShowUploadDialog(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Upload
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
          <div className="p-2 space-y-1">
            {filteredDocuments.map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                  selectedDoc?.id === doc.id
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{doc.title}</div>
                  <div className={`text-sm truncate ${
                    selectedDoc?.id === doc.id ? 'text-blue-100' : 'text-muted-foreground'
                  }`}>
                    Updated {doc.lastUpdated}
                  </div>
                </div>
              </button>
            ))}
          </div>
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
                    onClick={() => {
                      if (selectedDoc) {
                        setEditedTitle(selectedDoc.title);
                        setShowEditDialog(true);
                      }
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div>{selectedDoc.lastUpdated}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">File Type</div>
                  <div className="capitalize">{selectedDoc.fileType}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">File Size</div>
                  <div>{selectedDoc.fileSize}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Author</div>
                  <div>{selectedDoc.author}</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3>Preview</h3>
                <p>{selectedDoc.content}</p>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">No Document Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a document from the list to view its details
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
            <Button variant="destructive" onClick={() => {
              // Delete logic would go here
              setShowDeleteDialog(false);
            }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Upload a new document and provide its details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter document title..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Document File</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                      if (!editedTitle) {
                        setEditedTitle(file.name.split('.')[0]);
                      }
                    }
                  }}
                  className="flex-1"
                />
              </div>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditedTitle('');
              setUploadedFile(null);
              setShowUploadDialog(false);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Upload logic would go here
                setShowUploadDialog(false);
              }}
              disabled={!editedTitle || !uploadedFile}
            >
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update the document details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter document title..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Replace File (Optional)</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                    }
                  }}
                  className="flex-1"
                />
              </div>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              setUploadedFile(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Edit logic would go here
                setShowEditDialog(false);
              }}
              disabled={!editedTitle}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draft Confirmation Dialog */}
      <Dialog open={showDraftConfirmation} onOpenChange={setShowDraftConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draft Submitted for Review</DialogTitle>
            <DialogDescription>
              Your document has been submitted for review. A consultant leader will review and approve or reject your submission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDraftConfirmation(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}