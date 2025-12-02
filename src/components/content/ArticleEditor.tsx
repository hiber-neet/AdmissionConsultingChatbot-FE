import { useState, useEffect } from "react";
import { fastAPIArticles, fastAPIMajors, fastAPISpecializations } from '../../services/fastapi';
import { Article, Major, Specialization } from '../../utils/fastapi-client';

export default function ArticleEditor({ initialData }: { initialData?: { title: string } }) {
  console.log('ArticleEditor mounted with initialData:', initialData);
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [linkImage, setLinkImage] = useState("");
  const [note, setNote] = useState("");
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
        setMessage({ type: 'error', text: 'Failed to load majors data. Using fallback data.' });
        
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
        setMessage({ type: 'error', text: `Failed to load specializations for selected major.` });
        
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
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }
    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Description is required' });
      return;
    }
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'URL is required' });
      return;
    }
    if (!majorId) {
      setMessage({ type: 'error', text: 'Please select a major' });
      return;
    }
    if (!specializationId) {
      setMessage({ type: 'error', text: 'Please select a specialization' });
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
        note: note.trim() || null,
        major_id: majorId === 0 ? null : majorId,
        specialization_id: specializationId
      };

      console.log('Sending POST request to /articles with data:', articleData);
      
      const response = await fastAPIArticles.create(articleData);
      
      console.log('Received response:', response);
      
      setMessage({ type: 'success', text: `Article "${response.title}" added successfully!` });
      setCreatedArticle(response);
      
      // Reset form
      setTitle('');
      setDescription('');
      setUrl('');
      setLinkImage('');
      setNote('');
      setMajorId(0);
      setSpecializationId(0);
      
    } catch (error: any) {
      console.error('Error adding article:', error);
      const errorMessage = error.message || 'Failed to add article';
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
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Article Created Successfully!</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><strong>Article ID:</strong> {createdArticle.article_id}</div>
            <div><strong>Status:</strong> {createdArticle.status}</div>
            <div><strong>Title:</strong> {createdArticle.title}</div>
            <div><strong>Created By:</strong> {createdArticle.created_by}</div>
            <div><strong>Description:</strong> {createdArticle.description}</div>
            <div><strong>Created Date:</strong> {createdArticle.create_at}</div>
            <div><strong>URL:</strong> <a href={createdArticle.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{createdArticle.url}</a></div>
            <div><strong>Link Image:</strong> {createdArticle.link_image || 'N/A'}</div>
            <div><strong>Author:</strong> {createdArticle.author_name || 'N/A'}</div>
            <div><strong>Note:</strong> {createdArticle.note || 'N/A'}</div>
            <div><strong>Major ID:</strong> {createdArticle.major_id || 'N/A'}</div>
            <div><strong>Major Name:</strong> {createdArticle.major_name || 'N/A'}</div>
            <div><strong>Specialization ID:</strong> {createdArticle.specialization_id}</div>
            <div><strong>Specialization Name:</strong> {createdArticle.specialization_name || 'N/A'}</div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-white border rounded-xl p-3 mb-4 flex items-center gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article Title"
          className="flex-1 text-lg font-semibold outline-none"
        />
        <button 
          onClick={handleAddArticle}
          disabled={saving || loading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Adding...' : 'Add Article'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Editor - Updated */}
        <div className="bg-white border rounded-xl p-4 min-h-[60vh]">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Start writing your article description here..."
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
            <div className="text-sm text-gray-500 mb-1">Image URL</div>
            <input 
              value={linkImage}
              onChange={(e) => setLinkImage(e.target.value)}
              className="w-full border rounded-md px-2 py-2 text-sm" 
              placeholder="https://example.com/image.jpg" 
            />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Note</div>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-md px-2 py-2 text-sm resize-none" 
              placeholder="Optional note about this article..."
              rows={3}
            />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Major</div>
            <select 
              value={majorId} 
              onChange={(e) => {
                console.log('Major changed to:', e.target.value);
                setMajorId(Number(e.target.value));
              }}
              className="w-full border rounded-md px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            >
              <option value={0}>Select major</option>
              {majors.map((major) => (
                <option key={major.major_id} value={major.major_id}>
                  {major.major_name}
                </option>
              ))}
            </select>
            {loading && (
              <div className="text-xs text-blue-500 mt-1">Loading majors from API...</div>
            )}
            {majors.length === 0 && !loading && (
              <div className="text-xs text-red-500 mt-1">No majors available</div>
            )}
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Specialization</div>
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
                {loadingSpecializations ? 'Loading specializations...' : !majorId ? 'Select a major first' : 'Select specialization'}
              </option>
              {filteredSpecializations.map((spec) => (
                <option key={spec.specialization_id} value={spec.specialization_id}>
                  {spec.specialization_name}
                </option>
              ))}
            </select>
            {loadingSpecializations && (
              <div className="text-xs text-blue-500 mt-1">Loading specializations from API...</div>
            )}
            {majorId && filteredSpecializations.length === 0 && !loadingSpecializations && (
              <div className="text-xs text-gray-400 mt-1">No specializations available for this major</div>
            )}
            {!majorId && (
              <div className="text-xs text-gray-400 mt-1">Please select a major first</div>
            )}
          </div>

          {/* Status indicator */}
          <div className="border-t pt-4">
            <div className="text-xs text-gray-400">
              {saving ? 'Saving...' : 
               loading ? 'Loading majors from API...' : 
               loadingSpecializations ? 'Loading specializations...' :
               `Ready (${majors.length} majors, ${filteredSpecializations.length} specializations)`}
            </div>
            {majorId > 0 && (
              <div className="text-xs text-green-600 mt-1">
                Major selected: {majors.find(m => m.major_id === majorId)?.major_name}
              </div>
            )}
            {specializationId > 0 && (
              <div className="text-xs text-green-600">
                Specialization: {filteredSpecializations.find(s => s.specialization_id === specializationId)?.specialization_name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
