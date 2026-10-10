import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';

const AdminPostModal = ({ isOpen, onClose, liveProjects = [], adminPass }) => {
  const [selectedRepoId, setSelectedRepoId] = useState('');
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  // 3 distinct page paths to screenshot
  const [paths, setPaths] = useState(['/', '', '']);

  useEffect(() => {
    if (liveProjects.length > 0 && !selectedRepoId) {
      handleSelect(liveProjects[0]);
    }
  }, [liveProjects, isOpen]);

  const selectedRepo = liveProjects.find((p) => p.id === Number(selectedRepoId)) || liveProjects[0];

  const handleSelect = (repo) => {
    if (!repo) return;
    setSelectedRepoId(repo.id);
    setStatus({ type: '', msg: '' });
    setPaths(['/', '', '']);

    setCaption(
      `🚀 Just deployed: ${repo.name}\n\n` +
      `${repo.description || 'Fullstack application built with performance and modern architecture in mind.'}\n\n` +
      `🌐 Live Demo: ${repo.homepage}\n` +
      `💻 Stack: ${repo.language || 'React / Next.js'}\n\n` +
      `#buildinpublic #webdev #frontend #fullstack`
    );
  };

  // Helper to format full URL for subpages
  const getFullUrl = (path) => {
    if (!selectedRepo?.homepage) return '';
    const base = selectedRepo.homepage.replace(/\/+$/, '');
    if (!path || path.trim() === '' || path === '/') return base;
    return `${base}/${path.replace(/^\/+/, '')}`;
  };

  const handlePathChange = (index, value) => {
    const updated = [...paths];
    updated[index] = value;
    setPaths(updated);
  };

  const handlePost = async () => {
    if (!selectedRepo) return;
    setLoading(true);
    setStatus({ type: 'info', msg: 'Capturing selected pages and dispatching to X...' });

    // Gather valid URLs to capture
    const pageUrls = paths
      .map(p => getFullUrl(p))
      .filter(u => u && u.trim() !== '');

    try {
      const res = await fetch('/api/post-to-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrls,
          caption,
          adminPass,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ 
          type: 'success', 
          msg: `Published successfully! Tweet ID: ${data.tweetId}` 
        });
      } else {
        setStatus({ 
          type: 'error', 
          msg: data.error || 'Failed to publish post to X.' 
        });
      }
    } catch (err) {
      setStatus({ 
        type: 'error', 
        msg: `Network failure: ${err.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-lg text-white shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-6">
            <div>
              <span className="text-green-500 text-[10px] tracking-widest uppercase block mb-1">
                // ROOT_ACCESS_ACTIVE
              </span>
              <h2 className="text-xl font-black font-sans tracking-tight">
                X Dispatch Console
              </h2>
            </div>
            <button 
              onClick={onClose} 
              disabled={loading}
              className="text-neutral-500 hover:text-white p-1 transition-colors disabled:opacity-30"
            >
              <X size={20} />
            </button>
          </div>

          {liveProjects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded">
              <p className="text-neutral-400 text-xs">No active live deployments found in memory.</p>
            </div>
          ) : (
            <>
              {/* Project Target Selector */}
              <div className="mb-5">
                <label className="text-[11px] text-neutral-400 block mb-2 tracking-wider">
                  TARGET REPOSITORY DEPLOYMENT
                </label>
                <select
                  value={selectedRepoId}
                  onChange={(e) => handleSelect(liveProjects.find(p => p.id === Number(e.target.value)))}
                  className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs p-3 rounded focus:outline-none focus:border-white transition-colors"
                >
                  {liveProjects.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.name} — {repo.homepage}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3 Configurable Subpages */}
              {selectedRepo && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] text-neutral-400 tracking-wider flex items-center gap-1">
                      <Layers size={12} /> PAGES TO SCREENSHOT (UP TO 3)
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleSelect(selectedRepo)}
                      className="text-[10px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1"
                    >
                      <RefreshCw size={10} /> Reset Paths
                    </button>
                  </div>

                  {/* Route Input Rows */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {paths.map((p, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[9px] text-neutral-500 mb-1">
                          Page {idx + 1} {idx === 0 ? '(Home)' : '(Route/Path)'}
                        </span>
                        <input
                          type="text"
                          value={p}
                          onChange={(e) => handlePathChange(idx, e.target.value)}
                          placeholder={idx === 0 ? '/' : idx === 1 ? '/about' : '/dashboard'}
                          className="w-full bg-black border border-neutral-800 text-neutral-200 text-[11px] p-2 rounded focus:outline-none focus:border-white transition-colors font-mono"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Visual Previews */}
                  <div className="grid grid-cols-3 gap-2">
                    {paths.map((p, idx) => {
                      const fullUrl = getFullUrl(p);
                      return (
                        <div key={idx} className="relative border border-neutral-800 bg-black h-24 overflow-hidden rounded group">
                          <div className="absolute top-1 left-1 z-10 bg-black/85 px-1.5 py-0.5 text-[8px] flex items-center gap-1 text-neutral-400 rounded max-w-[90%] truncate">
                            <ExternalLink size={8} /> {p || '/'}
                          </div>
                          {fullUrl ? (
                            <img 
                              src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(fullUrl)}?w=1280&h=720`} 
                              alt={`Page ${idx + 1}`} 
                              className="w-full h-full object-cover object-top" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                              No Route
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Editable Caption */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] text-neutral-400 tracking-wider">
                    POST CAPTION
                  </label>
                  <span className={`text-[10px] ${caption.length > 280 ? 'text-red-400 font-bold' : 'text-neutral-500'}`}>
                    {caption.length} / 280
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter custom post copy..."
                  className="w-full bg-black border border-neutral-800 text-neutral-200 text-xs p-3 rounded focus:outline-none focus:border-white transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Status Banner */}
              {status.msg && (
                <div className={`p-3 rounded text-xs mb-4 flex items-center gap-2 border ${
                  status.type === 'success' ? 'bg-green-950/40 border-green-800 text-green-300' :
                  status.type === 'error' ? 'bg-red-950/40 border-red-800 text-red-300' :
                  'bg-neutral-900 border-neutral-800 text-neutral-300'
                }`}>
                  {status.type === 'success' && <CheckCircle size={14} className="shrink-0" />}
                  {status.type === 'error' && <AlertCircle size={14} className="shrink-0" />}
                  {status.type === 'info' && <Loader2 size={14} className="animate-spin shrink-0" />}
                  <span className="truncate">{status.msg}</span>
                </div>
              )}

              {/* Post Dispatch Button */}
              <button
                onClick={handlePost}
                disabled={loading || !selectedRepo || !caption.trim()}
                className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Capturing Pages & Publishing...
                  </>
                ) : (
                  <>
                    <Send size={14} /> Publish To X
                  </>
                )}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminPostModal;
