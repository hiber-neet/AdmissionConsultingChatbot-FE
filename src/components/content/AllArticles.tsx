import { Search, ChevronDown, Eye, MoreHorizontal, Edit, Trash2, X, ExternalLink, Calendar, User, BookOpen, Tag } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from '../ui/system_users/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/system_users/dropdown-menu';
import { fastAPIArticles, majorsAPI } from '../../services/fastapi';
import { Article, Major } from '../../utils/fastapi-client';
import { ARTICLE_STATUSES } from '../../constants/status';
import { useAuth } from '../../contexts/Auth';

export default function AllArticles({ onCreate, onNavigateToEditor, onNavigateToEditorWithData }: { 
  onCreate?: () => void; 
  onNavigateToEditor?: () => void;
  onNavigateToEditorWithData?: (articleData: { title: string }) => void;
}) {
  const { user, hasPermission, isContentManagerLeader } = useAuth();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất Cả Trạng Thái");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Majors");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleDetailsLoading, setArticleDetailsLoading] = useState(false);
  const [articleDetailsError, setArticleDetailsError] = useState<string | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [majorsLoading, setMajorsLoading] = useState(false);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState<Article | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch articles from FastAPI based on permissions
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is Admin or Content Manager Leader
        const isAdmin = hasPermission("Admin");
        const isLeader = isContentManagerLeader();
        
        let data: Article[];
        
        if (isAdmin || isLeader) {
          // Admin or Content Manager Leader: Get all articles
          console.log('Fetching all articles (Admin or Content Manager Leader)');
          data = await fastAPIArticles.getAll();
        } else if (hasPermission("Content Manager") && user?.id) {
          // Regular Content Manager: Get only their own articles
          console.log('Fetching articles by user ID:', user.id);
          data = await fastAPIArticles.getByUserId(parseInt(user.id));
        } else {
          // No permission
          setError('You do not have permission to view articles.');
          return;
        }
        
        setArticles(data);
      } catch (err) {
        setError('Failed to load articles. Please try again.');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchArticles();
    }
  }, [user, hasPermission, isContentManagerLeader]);

  // Fetch majors from FastAPI
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setMajorsLoading(true);
        const data = await majorsAPI.getAll();
        setMajors(data);
      } catch (err) {
        console.error('Error fetching majors:', err);
        // Don't set error state for majors, just log it
      } finally {
        setMajorsLoading(false);
      }
    };

    fetchMajors();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filtered = useMemo(
    () => articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = statusFilter === "Tất Cả Trạng Thái" || 
        (statusFilter === "Bản Nháp" && article.status === "draft") ||
        (statusFilter === "Bị Từ Chối" && article.status === "rejected") ||
        (statusFilter === "Đã Xuất Bản" && article.status === "published");
      const matchesCategory = categoryFilter === "All Majors" || 
        article.major_name === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    }),
    [articles, q, statusFilter, categoryFilter]
  );

  // Fetch detailed article information
  const fetchArticleDetails = async (articleId: number) => {
    console.log('🔍 Fetching article details for ID:', articleId);
    setArticleDetailsLoading(true);
    setArticleDetailsError(null);
    
    try {
      // Use the FastAPI client which automatically includes Bearer token
      const articleDetails = await fastAPIArticles.getById(articleId);
      console.log('✅ Article details fetched successfully:', articleDetails);
      
      setSelectedArticle(articleDetails);
    } catch (err) {
      console.error('💥 Error fetching article details:', err);
      setArticleDetailsError(err instanceof Error ? err.message : 'Failed to load article details');
    } finally {
      setArticleDetailsLoading(false);
    }
  };

  // Handle article click
  const handleArticleClick = (article: Article, event?: React.MouseEvent) => {
    // Prevent opening modal if clicking on checkbox, dropdown, or buttons
    if (event) {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.closest('button') ||
        target.closest('[role="menu"]') ||
        target.closest('[data-radix-menu-content]')
      ) {
        return;
      }
    }
    
    fetchArticleDetails(article.article_id);
  };

  // Close modal
  const closeModal = () => {
    setSelectedArticle(null);
    setArticleDetailsError(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">Content Library</div>
          <div className="text-xl font-semibold">
            Manage all articles and pages
          </div>
        </div>
        {onCreate ? (
          <button
            onClick={onCreate}
            className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
          >
            + Create Article
          </button>
        ) : onNavigateToEditor ? (
          <button
            onClick={onNavigateToEditor}
            className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
          >
            + Create Article
          </button>
        ) : (
          <a
            href="/content?tab=editor"
            className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
          >
            + Create Article
          </a>
        )}
      </div>

      {/* Toolbar */}
      <div ref={dropdownRef} className="bg-white border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md w-full max-w-md">
          <Search size={16} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="outline-none text-sm w-full"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowCategoryDropdown(false);
            }}
            className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
          >
            {statusFilter} <ChevronDown size={14} />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
              {ARTICLE_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowStatusDropdown(false);
            }}
            className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
          >
            {categoryFilter} <ChevronDown size={14} />
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setCategoryFilter("All Majors");
                  setShowCategoryDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md"
              >
                All Majors
              </button>
              {majorsLoading ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Loading majors...
                </div>
              ) : (
                majors.map((major) => (
                  <button
                    key={major.major_id}
                    onClick={() => {
                      setCategoryFilter(major.major_name);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 last:rounded-b-md"
                  >
                    {major.major_name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading articles...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Tiêu Đề</th>
                <th className="text-left px-2 py-3">Major</th>
                <th className="text-left px-2 py-3">Status</th>
                <th className="text-left px-2 py-3">Author</th>
                <th className="text-left px-2 py-3">Được Tạo Lúc</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((article, i) => {
                return (
                  <tr
                    key={article.article_id}
                    onClick={(event) => handleArticleClick(article, event)}
                    className="hover:bg-blue-50 hover:shadow-sm cursor-pointer transition-all duration-150"
                    title="Click to view article details"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {article.title}
                    </td>
                    <td className="px-2 py-3">{article.major_name}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full capitalize text-xs ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : article.status === "review"
                            ? "bg-yellow-100 text-yellow-700"
                            : article.status === "archived"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-2 py-3">{article.author_name}</td>
                    <td className="px-2 py-3">{article.create_at}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Show View for all users */}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchArticleDetails(article.article_id);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />Xem</DropdownMenuItem>
                          
                          {/* Show Edit/Delete only for Admin or Content Manager Leader */}
                          {(hasPermission("Admin") || isContentManagerLeader()) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingArticle(article);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />Chỉnh Sửa</DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmArticle(article);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />Xóa</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Article Details Modal */}
      {(selectedArticle || articleDetailsLoading || articleDetailsError) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Article Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {articleDetailsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">Loading article details...</span>
                </div>
              )}

              {articleDetailsError && (
                <div className="text-center py-12">
                  <div className="text-red-600 mb-4">❌ {articleDetailsError}</div>
                  <button
                    onClick={() => selectedArticle && fetchArticleDetails(selectedArticle.article_id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {selectedArticle && !articleDetailsLoading && !articleDetailsError && (
                <div className="space-y-6">
                  {/* Article Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedArticle.title}
                    </h3>
                    {selectedArticle.description && (
                      <p className="text-gray-600 text-lg">
                        {selectedArticle.description}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full capitalize text-sm font-medium ${
                        selectedArticle.status === "published"
                          ? "bg-green-100 text-green-800"
                          : selectedArticle.status === "review"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedArticle.status === "archived"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedArticle.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Article ID: {selectedArticle.article_id}
                    </span>
                  </div>

                  {/* Article Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Author Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Author Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Author:</span>
                          <span className="font-medium">{selectedArticle.author_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created by ID:</span>
                          <span>{selectedArticle.created_by}</span>
                        </div>
                      </div>
                    </div>

                    {/* Publication Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Publication Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span>{selectedArticle.create_at}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="capitalize">{selectedArticle.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Major & Specialization */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Academic Category
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Major:</span>
                          <span className="font-medium">{selectedArticle.major_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Major ID:</span>
                          <span>{selectedArticle.major_id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Specialization Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Specialization
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Specialization:</span>
                          <span className="font-medium">{selectedArticle.specialization_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Specialization ID:</span>
                          <span>{selectedArticle.specialization_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Article URL */}
                  {selectedArticle.url && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Article URL
                      </h4>
                      <a
                        href={selectedArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm"
                      >
                        {selectedArticle.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Link Image */}
                  {selectedArticle.link_image && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Article Image
                      </h4>
                      <div className="flex flex-col gap-2">
                        <a
                          href={selectedArticle.link_image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm break-all"
                        >
                          {selectedArticle.link_image}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                        {/* Image Preview */}
                        <div className="mt-2">
                          <img
                            src={selectedArticle.link_image}
                            alt={selectedArticle.title}
                            className="max-w-full h-auto rounded-lg border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {selectedArticle.note && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Note</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {selectedArticle.note}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        if (onNavigateToEditorWithData) {
                          onNavigateToEditorWithData({ title: selectedArticle.title });
                        }
                        closeModal();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Article
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >Đóng</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          majors={majors}
          onClose={() => setEditingArticle(null)}
          onSave={async (updatedData) => {
            try {
              await fastAPIArticles.update(editingArticle.article_id, updatedData);
              // Refresh articles list
              const isAdmin = hasPermission("Admin");
              const isLeader = isContentManagerLeader();
              let data: Article[];
              if (isAdmin || isLeader) {
                data = await fastAPIArticles.getAll();
              } else if (hasPermission("Content Manager") && user?.id) {
                data = await fastAPIArticles.getByUserId(parseInt(user.id));
              } else {
                return;
              }
              setArticles(data);
              setEditingArticle(null);
            } catch (err) {
              console.error('Error updating article:', err);
              alert('Failed to update article. Please try again.');
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmArticle && (
        <DeleteConfirmModal
          article={deleteConfirmArticle}
          onClose={() => setDeleteConfirmArticle(null)}
          onConfirm={async () => {
            try {
              await fastAPIArticles.delete(deleteConfirmArticle.article_id);
              // Refresh articles list
              const isAdmin = hasPermission("Admin");
              const isLeader = isContentManagerLeader();
              let data: Article[];
              if (isAdmin || isLeader) {
                data = await fastAPIArticles.getAll();
              } else if (hasPermission("Content Manager") && user?.id) {
                data = await fastAPIArticles.getByUserId(parseInt(user.id));
              } else {
                return;
              }
              setArticles(data);
              setDeleteConfirmArticle(null);
            } catch (err) {
              console.error('Error deleting article:', err);
              alert('Failed to delete article. Please try again.');
            }
          }}
        />
      )}
    </div>
  );
}

// Edit Article Modal Component
function EditArticleModal({ 
  article, 
  majors, 
  onClose, 
  onSave 
}: { 
  article: Article; 
  majors: Major[]; 
  onClose: () => void; 
  onSave: (data: Partial<Article>) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    title: article.title,
    description: article.description,
    url: article.url || '',
    link_image: article.link_image || '',
    note: article.note || '',
    major_id: article.major_id,
    specialization_id: article.specialization_id
  });
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch specializations when major changes
  useEffect(() => {
    const fetchSpecs = async () => {
      if (formData.major_id) {
        try {
          const { fastAPISpecializations } = await import('../../services/fastapi');
          const specs = await fastAPISpecializations.getByMajor(formData.major_id);
          setSpecializations(specs);
        } catch (err) {
          console.error('Error fetching specializations:', err);
        }
      } else {
        setSpecializations([]);
      }
    };
    fetchSpecs();
  }, [formData.major_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Article</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Link Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Image
              </label>
              <input
                type="url"
                value={formData.link_image}
                onChange={(e) => setFormData({ ...formData, link_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Major */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Major
              </label>
              <select
                value={formData.major_id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  major_id: e.target.value ? parseInt(e.target.value) : 0,
                  specialization_id: 0 // Reset specialization when major changes
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a major</option>
                {majors.map((major) => (
                  <option key={major.major_id} value={major.major_id}>
                    {major.major_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization */}
            {formData.major_id && specializations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  value={formData.specialization_id || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    specialization_id: e.target.value ? parseInt(e.target.value) : 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a specialization</option>
                  {specializations.map((spec: any) => (
                    <option key={spec.specialization_id} value={spec.specialization_id}>
                      {spec.specialization_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({ 
  article, 
  onClose, 
  onConfirm 
}: { 
  article: Article; 
  onClose: () => void; 
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Delete Article</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this article?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900">{article.title}</p>
            <p className="text-sm text-gray-600 mt-1">{article.description}</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            This action will mark the article as deleted. It will no longer appear in the article list.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Xóa'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >Hủy</button>
        </div>
      </div>
    </div>
  );
}
