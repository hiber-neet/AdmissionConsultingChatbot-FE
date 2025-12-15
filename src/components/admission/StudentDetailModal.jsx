import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, Award, Brain, TrendingUp, BookOpen } from 'lucide-react';
import { riasecAPI, academicScoresAPI } from '../../services/fastapi';
import { API_CONFIG } from '../../config/api.js';

export function StudentDetailModal({ isOpen, onClose, userId }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [riasecResults, setRiasecResults] = useState([]);
  const [riasecLoading, setRiasecLoading] = useState(false);
  const [academicScores, setAcademicScores] = useState(null);
  const [scoresLoading, setScoresLoading] = useState(false);

  // Fetch student details
  const fetchStudentDetail = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No authentication token found');

      const idString = String(id);
      let numericId;
      if (idString.startsWith('ST')) {
        numericId = idString.replace('ST', '').replace(/^0+/, '') || '1';
      } else {
        numericId = idString;
      }
      
      const baseUrl = API_CONFIG.FASTAPI_BASE_URL;
      const url = `${baseUrl}/users/${numericId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStudent(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch RIASEC results
  const fetchRiasecResults = async (id) => {
    if (!id) return;
    
    setRiasecLoading(true);

    try {
      const idString = String(id);
      let numericId;
      if (idString.startsWith('ST')) {
        numericId = parseInt(idString.replace('ST', '').replace(/^0+/, '') || '1');
      } else {
        numericId = parseInt(idString);
      }
      
      const response = await riasecAPI.getUserResults(numericId);
      setRiasecResults(response || []);

    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('RIASEC fetch error:', err);
      }
    } finally {
      setRiasecLoading(false);
    }
  };

  // Fetch Academic Scores
  const fetchAcademicScores = async (id) => {
    if (!id) return;
    
    setScoresLoading(true);

    try {
      const idString = String(id);
      let numericId;
      if (idString.startsWith('ST')) {
        numericId = parseInt(idString.replace('ST', '').replace(/^0+/, '') || '1');
      } else {
        numericId = parseInt(idString);
      }
      
      const response = await academicScoresAPI.getUserAcademicScores(numericId);
      setAcademicScores(response || null);

    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Academic scores fetch error:', err);
      }
      setAcademicScores(null);
    } finally {
      setScoresLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchStudentDetail(userId);
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (student && isOpen) {
      fetchRiasecResults(userId);
      fetchAcademicScores(userId);
    }
  }, [student, isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container - Almost Full Screen */}
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-[#EB5A0D] text-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Hồ Sơ Học Sinh</h1>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full p-16">
              <div className="relative">
                <div className="w-20 h-20 border-8 border-orange-200 border-t-[#EB5A0D] rounded-full animate-spin"></div>
                <User className="absolute inset-0 m-auto h-10 w-10 text-[#EB5A0D]" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">Đang tải thông tin...</h3>
              <p className="mt-2 text-gray-500">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full p-16">
              <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Không thể tải thông tin</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => fetchStudentDetail(userId)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {student && !loading && !error && (
            <div className="p-8 space-y-6">
              {/* Student Header Card */}
              <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-lg p-8">
                <div className="flex items-start gap-8">
                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {student.full_name || 'Chưa cập nhật'}
                        </h2>
                        <div className="flex items-center gap-3">
                          {student.status ? (
                            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              Đang hoạt động
                            </span>
                          ) : (
                            <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                              Không hoạt động
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Mail className="h-5 w-5 text-[#EB5A0D]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Email</p>
                          <a 
                            href={`mailto:${student.email}`}
                            className="text-sm font-medium text-[#EB5A0D] hover:text-orange-700 truncate block"
                          >
                            {student.email || 'Chưa cập nhật'}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Phone className="h-5 w-5 text-[#EB5A0D]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Số điện thoại</p>
                          <a 
                            href={`tel:${student.phone_number}`}
                            className="text-sm font-medium text-[#EB5A0D] hover:text-orange-700 truncate block"
                          >
                            {student.phone_number || 'Chưa cập nhật'}
                          </a>
                        </div>
                      </div>

                      {student.created_at && (
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-[#EB5A0D]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Ngày đăng ký</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(student.created_at).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {student.role_name && (
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <Award className="h-5 w-5 text-[#EB5A0D]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Vai trò</p>
                            <p className="text-sm font-medium text-gray-900">{student.role_name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIASEC Section */}
              <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-lg overflow-hidden">
                <div className="bg-[#EB5A0D] px-8 py-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Kết Quả Trắc Nghiệm RIASEC</h3>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {riasecLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="relative">
                        <div className="w-16 h-16 border-8 border-orange-200 border-t-[#EB5A0D] rounded-full animate-spin"></div>
                        <Brain className="absolute inset-0 m-auto h-8 w-8 text-[#EB5A0D]" />
                      </div>
                      <p className="mt-4 text-gray-600 font-medium">Đang tải kết quả RIASEC...</p>
                    </div>
                  )}

                  {!riasecLoading && riasecResults.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="h-10 w-10 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Chưa có kết quả</h4>
                      <p className="text-gray-600">Học sinh chưa thực hiện bài trắc nghiệm RIASEC</p>
                    </div>
                  )}

                  {!riasecLoading && riasecResults.length > 0 && (
                    <div className="space-y-8">
                      {riasecResults.map((result, index) => (
                        <div key={index} className="border-2 border-orange-100 rounded-xl overflow-hidden">
                          {/* Result Header */}
                          <div className="bg-orange-50 px-6 py-4 border-b-2 border-orange-100">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-gray-900">
                                Kết quả lần {riasecResults.length - index}
                              </h4>
                              <span className="px-3 py-1 bg-white border border-orange-200 rounded-full text-xs font-semibold text-[#EB5A0D]">
                                ID: {result.result_id}
                              </span>
                            </div>
                          </div>

                          <div className="p-6">
                            {/* Personality Type */}
                            {result.result && (
                              <div className="mb-8">
                                <div className="bg-[#EB5A0D] rounded-xl p-8 text-center shadow-xl">
                                  <p className="text-white/90 text-sm font-semibold uppercase tracking-widest mb-2">
                                    Loại Tính Cách
                                  </p>
                                  <p className="text-white text-4xl font-extrabold tracking-tight">
                                    {result.result}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* RIASEC Bars */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-[#EB5A0D]" />
                                <h5 className="text-lg font-bold text-gray-900">Biểu Đồ Điểm Số Chi Tiết</h5>
                              </div>

                              {[
                                { 
                                  key: 'score_realistic', 
                                  label: 'Thực Tế (Realistic)', 
                                  color: 'from-green-500 to-emerald-600',
                                  bg: 'bg-green-50',
                                  border: 'border-green-200'
                                },
                                { 
                                  key: 'score_investigative', 
                                  label: 'Nghiên Cứu (Investigative)', 
                                  color: 'from-blue-500 to-cyan-600',
                                  bg: 'bg-blue-50',
                                  border: 'border-blue-200'
                                },
                                { 
                                  key: 'score_artistic', 
                                  label: 'Nghệ Thuật (Artistic)', 
                                  color: 'from-purple-500 to-violet-600',
                                  bg: 'bg-purple-50',
                                  border: 'border-purple-200'
                                },
                                { 
                                  key: 'score_social', 
                                  label: 'Xã Hội (Social)', 
                                  color: 'from-orange-500 to-amber-600',
                                  bg: 'bg-orange-50',
                                  border: 'border-orange-200'
                                },
                                { 
                                  key: 'score_enterprising', 
                                  label: 'Kinh Doanh (Enterprising)', 
                                  color: 'from-red-500 to-rose-600',
                                  bg: 'bg-red-50',
                                  border: 'border-red-200'
                                },
                                { 
                                  key: 'score_conventional', 
                                  label: 'Quy Ước (Conventional)', 
                                  color: 'from-gray-500 to-slate-600',
                                  bg: 'bg-gray-50',
                                  border: 'border-gray-200'
                                }
                              ].map(({ key, label, color, bg, border }) => {
                                const score = result[key] || 0;
                                const percentage = (score / 5.0) * 100;
                                
                                return (
                                  <div key={key} className={`${bg} border ${border} rounded-xl p-5`}>
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-bold text-gray-900">{label}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl font-extrabold text-gray-900">
                                          {score.toFixed(1)}
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium">/5.0</span>
                                      </div>
                                    </div>
                                    <div className="relative h-8 bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                                      <div 
                                        className={`h-full bg-gradient-to-r ${color} transition-all duration-700 ease-out relative`}
                                        style={{ width: `${percentage}%` }}
                                      >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-gray-700 drop-shadow-sm">
                                          {percentage.toFixed(0)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Scores Section */}
              <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-lg overflow-hidden">
                <div className="bg-[#EB5A0D] px-8 py-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Kết Quả Học Tập</h3>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {scoresLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="relative">
                        <div className="w-16 h-16 border-8 border-orange-200 border-t-[#EB5A0D] rounded-full animate-spin"></div>
                        <BookOpen className="absolute inset-0 m-auto h-8 w-8 text-[#EB5A0D]" />
                      </div>
                      <p className="mt-4 text-gray-600 font-medium">Đang tải kết quả học tập...</p>
                    </div>
                  )}

                  {!scoresLoading && !academicScores && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-10 w-10 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Chưa có dữ liệu</h4>
                      <p className="text-gray-600">Học sinh chưa cập nhật kết quả học tập</p>
                    </div>
                  )}

                  {!scoresLoading && academicScores && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'math', label: 'Toán', color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', border: 'border-blue-200' },
                        { key: 'literature', label: 'Ngữ Văn', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', border: 'border-purple-200' },
                        { key: 'english', label: 'Tiếng Anh', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200' },
                        { key: 'physics', label: 'Vật Lý', color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
                        { key: 'chemistry', label: 'Hóa Học', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                        { key: 'biology', label: 'Sinh Học', color: 'from-lime-500 to-green-600', bg: 'bg-lime-50', border: 'border-lime-200' },
                        { key: 'history', label: 'Lịch Sử', color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                        { key: 'geography', label: 'Địa Lý', color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', border: 'border-teal-200' },
                      ].map(({ key, label, color, bg, border }) => {
                        const score = academicScores[key] || 0;
                        const percentage = (score / 10.0) * 100;
                        
                        return (
                          <div key={key} className={`${bg} border ${border} rounded-xl p-5`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-900">{label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-extrabold text-gray-900">
                                  {score.toFixed(1)}
                                </span>
                                <span className="text-sm text-gray-500 font-medium">/10</span>
                              </div>
                            </div>
                            <div className="relative h-8 bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                              <div 
                                className={`h-full bg-gradient-to-r ${color} transition-all duration-700 ease-out relative`}
                                style={{ width: `${percentage}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-700 drop-shadow-sm">
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
