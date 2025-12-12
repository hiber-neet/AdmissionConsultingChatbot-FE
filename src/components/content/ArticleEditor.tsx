import { useState, useEffect } from "react";
import { fastAPIArticles, fastAPIMajors, fastAPISpecializations } from '../../services/fastapi';
import { Article, Major, Specialization } from '../../utils/fastapi-client';

export default function ArticleEditor({ initialData }: { initialData?: { title: string } }) {
  console.log('ArticleEditor mounted with initialData:', initialData);
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [linkImage, setLinkImage] = useState("");
  const [majorId, setMajorId] = useState<number>(0);
  const [specializationId, setSpecializationId] = useState<number>(0);
  
  const [majors, setMajors] = useState<Major[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [filteredSpecializations, setFilteredSpecializations] = useState<Specialization[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [createdArticle, setCreatedArticle] = useState<any>(null);

  // Fetch majors on component mount
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setLoading(true);
        console.log('Fetching majors from API...');
        
        // Fetch majors from the real API
        const majorsData = await fastAPIMajors.getAll();
        console.log('Majors data received:', majorsData);
        
        setMajors(majorsData);
        
      } catch (error) {
        console.error('Error fetching majors:', error);
        setMessage({ type: 'error', text: 'Không thể tải dữ liệu ngành. Sử dụng dữ liệu dự phòng.' });
        
        // Fallback to mock data if API fails
        const mockMajors: Major[] = [
          { major_id: 1, major_name: "Computer Science" },
          { major_id: 2, major_name: "Business Administration" },
          { major_id: 3, major_name: "Engineering" },
          { major_id: 4, major_name: "Psychology" },
        ];

        setMajors(mockMajors);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  // Fetch specializations when major is selected
  useEffect(() => {
    const fetchSpecializations = async () => {
      if (!majorId) {
        setFilteredSpecializations([]);
        return;
      }

      try {
        setLoadingSpecializations(true);
        console.log('Fetching specializations for majorId:', majorId);
        
        // Fetch specializations for the selected major
        const specializationsData = await fastAPISpecializations.getByMajor(majorId);
        console.log('Specializations data received:', specializationsData);
        
        setFilteredSpecializations(specializationsData);
        
        // Reset specialization selection if current one is not valid for new major
        if (specializationId && !specializationsData.some(spec => spec.specialization_id === specializationId)) {
          setSpecializationId(0);
        }
        
      } catch (error) {
        console.error('Error fetching specializations:', error);
        setMessage({ type: 'error', text: `Không thể tải chuyên ngành cho ngành đã chọn.` });
        
        // Fallback to mock data filtered by major
        const mockSpecializations: Specialization[] = [
          { specialization_id: 1, specialization_name: "Software Engineering", major_id: 1 },
          { specialization_id: 2, specialization_name: "Information Technology", major_id: 1 },
          { specialization_id: 3, specialization_name: "Data Science", major_id: 1 },
          { specialization_id: 4, specialization_name: "Artificial Intelligence", major_id: 1 },
          { specialization_id: 5, specialization_name: "Financial Management", major_id: 2 },
          { specialization_id: 6, specialization_name: "Marketing", major_id: 2 },
        ];
        
        const filtered = mockSpecializations.filter(spec => spec.major_id === majorId);
        setFilteredSpecializations(filtered);
      } finally {
        setLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, [majorId, specializationId]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddArticle = async () => {
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Tiêu đề là bắt buộc' });
      return;
    }
    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Mô tả là bắt buộc' });
      return;
    }
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'URL là bắt buộc' });
      return;
    }
    if (!majorId) {
      setMessage({ type: 'error', text: 'Vui lòng chọn ngành' });
      return;
    }
    if (!specializationId) {
      setMessage({ type: 'error', text: 'Vui lòng chọn chuyên ngành' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      setCreatedArticle(null);

      const articleData = {
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        link_image: linkImage.trim() || null,
        major_id: majorId === 0 ? null : majorId,
        specialization_id: specializationId
      };

      console.log('Sending POST request to /articles with data:', articleData);
      
      const response = await fastAPIArticles.create(articleData);
      
      console.log('Received response:', response);
      
      setMessage({ type: 'success', text: `Bài viết "${response.title}" đã được thêm thành công!` });
      setCreatedArticle(response);
      
      // Reset form
      setTitle('');
      setDescription('');
      setUrl('');
      setLinkImage('');
      setMajorId(0);
      setSpecializationId(0);
      
    } catch (error: any) {
      console.error('Error adding article:', error);
      const errorMessage = error.message || 'Không thể thêm bài viết';
      setMessage({ type: 'error', text: errorMessage });
      setCreatedArticle(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Created Article Display */}
      {createdArticle && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800">Thành Công!</h3>
          <p className="text-sm text-green-700 mt-1">Bài viết đã được thêm thành công.</p>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-white border rounded-xl p-3 mb-4 flex items-center gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu Đề Bài Viết"
          className="flex-1 text-lg font-semibold outline-none"
        />
        <button 
          onClick={handleAddArticle}
          disabled={saving || loading}
          className="px-4 py-2 rounded-md bg-[#EB5A0D] text-white text-sm hover:bg-[#d14f0a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Đang Thêm...' : 'Thêm Bài Viết'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Editor - Updated */}
        <div className="bg-white border rounded-xl p-4 min-h-[60vh]">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bắt đầu viết mô tả bài viết tại đây..."
            className="w-full min-h-[50vh] outline-none resize-none"
          />
        </div>

        {/* Side panel */}
        <div className="bg-white border rounded-xl p-4 space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">URL</div>
            <input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border rounded-md px-2 py-2 text-sm" 
              placeholder="https://example.com/article-url" 
            />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">URL Ảnh</div>
            <input 
              value={linkImage}
              onChange={(e) => setLinkImage(e.target.value)}
              className="w-full border rounded-md px-2 py-2 text-sm" 
              placeholder="https://example.com/image.jpg" 
            />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Ngành</div>
            <select 
              value={majorId} 
              onChange={(e) => {
                console.log('Major changed to:', e.target.value);
                setMajorId(Number(e.target.value));
              }}
              className="w-full border rounded-md px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            >
              <option value={0}>Chọn ngành</option>
              {majors.map((major) => (
                <option key={major.major_id} value={major.major_id}>
                  {major.major_name}
                </option>
              ))}
            </select>
            {loading && (
              <div className="text-xs text-blue-500 mt-1">Đang tải ngành từ API...</div>
            )}
            {majors.length === 0 && !loading && (
              <div className="text-xs text-red-500 mt-1">Không có ngành khả dụng</div>
            )}
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Chuyên Ngành</div>
            <select 
              value={specializationId} 
              onChange={(e) => {
                console.log('Specialization changed to:', e.target.value);
                setSpecializationId(Number(e.target.value));
              }}
              className="w-full border rounded-md px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading || !majorId || loadingSpecializations}
            >
              <option value={0}>
                {loadingSpecializations ? 'Đang tải chuyên ngành...' : !majorId ? 'Chọn ngành trước' : 'Chọn chuyên ngành'}
              </option>
              {filteredSpecializations.map((spec) => (
                <option key={spec.specialization_id} value={spec.specialization_id}>
                  {spec.specialization_name}
                </option>
              ))}
            </select>
            {loadingSpecializations && (
              <div className="text-xs text-blue-500 mt-1">Đang tải chuyên ngành từ API...</div>
            )}
            {!majorId && (
              <div className="text-xs text-gray-400 mt-1">Vui lòng chọn ngành trước</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
