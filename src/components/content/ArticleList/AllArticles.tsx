import { useMemo, useState, useEffect } from "react";
import { fastAPIArticles, majorsAPI } from '../../../services/fastapi';
import { Article, Major } from '../../../utils/fastapi-client';
import { useAuth } from '../../../contexts/Auth';
import ArticleToolbar from './ArticleToolbar';
import ArticleTable from './ArticleTable';
import ArticleDetailsModal from './ArticleDetailsModal';
import EditArticleModal from './EditArticleModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function AllArticles({ onCreate, onNavigateToEditor, onNavigateToEditorWithData }: { 
  onCreate?: () => void; 
  onNavigateToEditor?: () => void;
  onNavigateToEditorWithData?: (articleData: { title: string }) => void;
}) {
  const { user, hasPermission, isContentManagerLeader } = useAuth();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất Cả Trạng Thái");
  const [categoryFilter, setCategoryFilter] = useState<string>("Tất Cả Ngành");
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
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState<Article | null>(null);

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

  const filtered = useMemo(
    () => articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = statusFilter === "Tất Cả Trạng Thái" || 
        (statusFilter === "Bản Nháp" && article.status === "draft") ||
        (statusFilter === "Bị Từ Chối" && article.status === "rejected") ||
        (statusFilter === "Đã Xuất Bản" && article.status === "published");
      const matchesCategory = categoryFilter === "Tất Cả Ngành" || 
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

  // Handler for closing dropdowns
  const handleCloseDropdowns = () => {
    setShowStatusDropdown(false);
    setShowCategoryDropdown(false);
  };

  // Handler for status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  };

  // Handler for category filter change
  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setShowCategoryDropdown(false);
  };

  // Handler for toggling status dropdown
  const handleToggleStatusDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
    setShowCategoryDropdown(false);
  };

  // Handler for toggling category dropdown
  const handleToggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowStatusDropdown(false);
  };

  // Refresh articles list
  const refreshArticles = async () => {
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
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xl font-semibold">
            Danh Sách Bài Viết
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
            className="px-3 py-2 rounded-md text-white text-sm transition-colors bg-[#EB5A0D] hover:bg-[#d14f0a]"
          >
            + Tạo Bài Viết
          </button>
        ) : (
          <a
            href="/content?tab=editor"
            className="px-3 py-2 rounded-md text-white text-sm transition-colors bg-[#EB5A0D] hover:bg-[#d14f0a]"
          >
            + Tạo Bài Viết
          </a>
        )}
      </div>

      {/* Toolbar */}
      <ArticleToolbar
        searchQuery={q}
        onSearchChange={setQ}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        showStatusDropdown={showStatusDropdown}
        onToggleStatusDropdown={handleToggleStatusDropdown}
        showCategoryDropdown={showCategoryDropdown}
        onToggleCategoryDropdown={handleToggleCategoryDropdown}
        majors={majors}
        majorsLoading={majorsLoading}
        onClickOutside={handleCloseDropdowns}
      />

      {/* Table */}
      <ArticleTable
        articles={filtered}
        loading={loading}
        error={error}
        canEdit={hasPermission("Admin") || isContentManagerLeader()}
        onArticleClick={handleArticleClick}
        onView={(article) => fetchArticleDetails(article.article_id)}
        onEdit={setEditingArticle}
        onDelete={setDeleteConfirmArticle}
      />

      {/* Article Details Modal */}
      <ArticleDetailsModal
        article={selectedArticle}
        loading={articleDetailsLoading}
        error={articleDetailsError}
        onClose={closeModal}
        onRetry={() => selectedArticle && fetchArticleDetails(selectedArticle.article_id)}
      />

      {/* Edit Article Modal */}
      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          majors={majors}
          onClose={() => setEditingArticle(null)}
          onSave={async (updatedData) => {
            try {
              await fastAPIArticles.update(editingArticle.article_id, updatedData);
              await refreshArticles();
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
              await refreshArticles();
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
