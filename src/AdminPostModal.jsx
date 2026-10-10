import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Smartphone, 
  Monitor, 
  Tablet, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

const AdminPostModal = ({ isOpen, onClose, liveProjects = [], adminPass }) => {
  const [selectedRepoId, setSelectedRepoId] = useState('');
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  // Set default selection when liveProjects loads or modal opens
  useEffect(() => {
    if (liveProjects.length > 0 && !selectedRepoId) {
      handleSelect(liveProjects[0]);
    }
  }, [liveProjects, isOpen]);

  const selectedRepo = liveProjects.find((p) => p.id === Number(selectedRepoId)) || liveProjects[0];

  // Auto-generate caption template based on chosen repo
  const handleSelect = (repo) => {
    if (!repo) return;
    setSelectedRepoId(repo.id);
    setStatus({ type: '', msg: '' });
    setCaption(
      `🚀 Just deployed: ${repo.name}\n\n` +
      `${repo.description || 'Fullstack application built with performance and modern architecture in mind.'}\n\n` +
      `🌐 Live Demo: ${repo.homepage}\n` +
      `💻 Stack: ${repo.language || 'React / Next.js'}\n\n` +
      `#buildinpublic #webdev #frontend #fullstack`
    );
  };

  const handlePost = async () => {
    if (!selectedRepo) return;
    setLoading(true);
    setStatus({ type: 'info', msg: 'Capturing 3 viewports and dispatching to X...' });

    try {
      const res = await fetch('/api/post-to-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl: selectedRepo.homepage,
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
          className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl p-6 rounded-lg text-white shadow-2xl relative"
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

              {/* 3 Viewport Screenshot Queues */}
              {selectedRepo && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] text-neutral-400 tracking-wider">
                      MEDIA ATTACHMENTS (3 VIEWPORTS QUEUED)
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleSelect(selectedRepo)}
                      className="text-[10px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1"
                    >
                      <RefreshCw size={10} /> Reset Caption
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Desktop */}
                    <div className="relative border border-neutral-800 bg-black h-24 overflow-hidden rounded group">
                      <div className="absolute top-1 left-1 z-10 bg-black/80 px-1.5 py-0.5 text-[9px] flex items-center gap-1 text-neutral-400 rounded">
                        <Monitor size={10} /> Desktop (1280x720)
                      </div>
                      <img 
                        src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(selectedRepo.homepage)}?w=1280&h=720`} 
                        alt="Desktop Preview" 
                        className="w-full h-full object-cover object-top" 
                      />
                    </div>
                    {/* Tablet / Square */}
                    <div className="relative border border-neutral-800 bg-black h-24 overflow-hidden rounded group">
                      <div className="absolute top-1 left-1 z-10 bg-black/80 px-1.5 py-0.5 text-[9px] flex items-center gap-1 text-neutral-400 rounded">
                        <Tablet size={10} /> Tablet (800x800)
                      </div>
                      <img 
                        src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(selectedRepo.homepage)}?w=800&h=800`} 
                        alt="Tablet Preview" 
                        className="w-full h-full object-cover object-top" 
                      />
                    </div>
                    {/* Mobile */}
                    <div className="relative border border-neutral-800 bg-black h-24 overflow-hidden rounded group">
                      <div className="absolute top-1 left-1 z-10 bg-black/80 px-1.5 py-0.5 text-[9px] flex items-center gap-1 text-neutral-400 rounded">
                        <Smartphone size={10} /> Mobile (390x844)
                      </div>
                      <img 
                        src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(selectedRepo.homepage)}?w=390&h=844`} 
                        alt="Mobile Preview" 
                        className="w-full h-full object-cover object-top" 
                      />
                    </div>
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
                  rows={5}
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
                    <Loader2 size={14} className="animate-spin" /> Transmitting 3 Screenshots & Text...
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
