import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, LogOut, Upload, Eye, Trash2, AlertCircle,
  CheckCircle2, Loader2, Shield, BookOpen, RefreshCw
} from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { uploadExcelWorkbook, resetToDefault } from '@/services/questionBank';
import { QuizModule } from '@/types';

export default function AdminPage() {
  const { isAuthenticated, login, logout, loginError } = useAdminStore();
  const { categories, refresh } = useCategoryStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [previewModules, setPreviewModules] = useState<QuizModule[] | null>(null);
  const [previewCategoryName, setPreviewCategoryName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);
    setPreviewModules(null);

    try {
      const modules = await uploadExcelWorkbook(file, 'nasscom');
      refresh();
      setUploadResult({
        success: true,
        message: `Successfully loaded ${modules.length} modules with ${modules.reduce((s, m) => s + m.questions.length, 0)} total questions.`,
      });
      setPreviewModules(modules);
      setPreviewCategoryName('NASSCOM Digital Edge 101');
    } catch (err) {
      setUploadResult({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to parse the Excel file.',
      });
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    resetToDefault();
    refresh();
    setPreviewModules(null);
    setUploadResult({ success: true, message: 'Question bank reset to default NASSCOM Digital Edge 101 data.' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Shield size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Panel</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to manage the question bank</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Username
                </label>
                <input
                  data-testid="input-admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10
                    bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400
                    focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                    transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <input
                  data-testid="input-admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10
                    bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400
                    focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                    transition-all duration-200"
                />
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2"
                >
                  <AlertCircle size={14} />
                  {loginError}
                </motion.div>
              )}

              <motion.button
                data-testid="button-admin-login"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold
                  bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                  text-white shadow-lg shadow-indigo-500/30 transition-all duration-200"
              >
                <Lock size={16} />
                Sign In
              </motion.button>
            </form>

            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
              Default: alrdot / 601364
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated view
  const nasscomCategory = categories.find((c) => c.id === 'nasscom');
  const displayModules = previewModules ?? nasscomCategory?.modules ?? [];

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Admin Panel</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Question Bank Management</p>
            </div>
          </div>
          <motion.button
            data-testid="button-admin-logout"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
              text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <LogOut size={15} />
            Logout
          </motion.button>
        </motion.div>

        {/* Upload section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 shadow-xl p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <Upload size={18} className="text-indigo-500" />
            Upload Question Bank
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Upload an Excel workbook (.xlsx). Each sheet becomes a module. Existing data will be replaced.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <label
              data-testid="button-upload-excel"
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed
                font-semibold text-sm cursor-pointer transition-all duration-200
                ${uploading
                  ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 cursor-not-allowed'
                  : 'border-gray-300 dark:border-white/20 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? 'Parsing workbook...' : 'Choose Excel file (.xlsx)'}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <motion.button
              data-testid="button-reset-default"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10
                text-sm font-semibold text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20
                hover:bg-gray-50 dark:hover:bg-white/5 transition-all whitespace-nowrap"
            >
              <RefreshCw size={15} />
              Reset to Default
            </motion.button>
          </div>

          {/* Upload result */}
          <AnimatePresence>
            {uploadResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 flex items-start gap-2 p-3 rounded-xl text-sm ${
                  uploadResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/40'
                }`}
              >
                {uploadResult.success
                  ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                {uploadResult.message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Module preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye size={18} className="text-indigo-500" />
              Module Preview — {previewCategoryName || (nasscomCategory ? nasscomCategory.name : 'NASSCOM')}
            </h2>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-full">
              {displayModules.length} modules · {displayModules.reduce((s, m) => s + m.questions.length, 0)} total questions
            </span>
          </div>

          {displayModules.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={32} className="text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-600">No modules loaded</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/10">
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">#</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Module Name</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-gray-600 dark:text-gray-400">Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayModules.map((mod, idx) => (
                    <motion.tr
                      key={mod.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-3 text-gray-400 dark:text-gray-600">{idx + 1}</td>
                      <td className="py-3 px-3 font-medium text-gray-800 dark:text-gray-200" data-testid={`text-module-name-${idx}`}>{mod.name}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{mod.questions.length}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 dark:border-white/20">
                    <td colSpan={2} className="py-2.5 px-3 font-bold text-gray-700 dark:text-gray-300">Total</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-gray-900 dark:text-white">
                      {displayModules.reduce((s, m) => s + m.questions.length, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
