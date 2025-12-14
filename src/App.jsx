import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate,
  useTransform
} from 'framer-motion';
import { 
  Github, 
  Instagram, 
  Linkedin, 
  ArrowUpRight, 
  Download, 
  Mail, 
  Database, 
  Layers, 
  Zap,
  Code2,
  Terminal,
  Cpu,
  Palette,
  Globe,
  Smartphone,
  Server,
  Box,
  Monitor,
  PenTool,
  Award,
  Briefcase,
  Triangle as TriangleIcon 
} from 'lucide-react';

// --- Utility ---
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// --- Components ---

// 1. UNIQUE BACKGROUND GENERATOR
// This creates a special pattern for every project based on its ID/Index
const ProjectBackground = ({ index }) => {
  const variant = index % 5; // 5 different styles
  const rotation = (index * 25) % 360; // Unique rotation for each
  const scale = 1 + (index % 3) * 0.2; // Unique scale

  return (
    <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden opacity-20 transition-opacity group-hover:opacity-40 duration-500">
      <div 
        className="w-full h-full p-8 flex flex-wrap content-center justify-center gap-4"
        style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
      >
        {/* Style 1: Matrix Dots */}
        {variant === 0 && [...Array(40)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white rounded-full" />
        ))}

        {/* Style 2: Tech Dashes */}
        {variant === 1 && [...Array(20)].map((_, i) => (
          <div key={i} className="w-8 h-1 bg-neutral-700/50" />
        ))}

        {/* Style 3: Hollow Squares */}
        {variant === 2 && [...Array(10)].map((_, i) => (
          <div key={i} className="w-12 h-12 border border-neutral-800" />
        ))}

        {/* Style 4: Diagonal Rain */}
        {variant === 3 && [...Array(15)].map((_, i) => (
          <div key={i} className="w-32 h-[1px] bg-white -rotate-45" />
        ))}

        {/* Style 5: Binary Blocks */}
        {variant === 4 && [...Array(12)].map((_, i) => (
          <div key={i} className={`w-4 h-4 ${i % 2 === 0 ? 'bg-white' : 'bg-transparent border border-white'}`} />
        ))}
      </div>
    </div>
  );
};

// 2. Background Grid Pattern
const GridBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
       style={{
         backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px),
                           linear-gradient(to bottom, #808080 1px, transparent 1px)`,
         backgroundSize: '40px 40px'
       }} 
  />
);

// 3. Magnetic Button
const MagneticButton = ({ children, className, onClick, href, download, target }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3); 
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      href={href}
      download={download}
      target={target}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("relative z-10 inline-flex cursor-pointer items-center justify-center", className)}
    >
      {children}
    </Component>
  );
};

// 4. Kinetic Typography (Marquee)
const Marquee = ({ text, direction = 1, speed = 5 }) => {
  const x = useMotionValue(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      x.set(x.get() + direction * (speed * 0.05));
      if (direction === 1 && x.get() > 0) x.set(-100);
      if (direction === -1 && x.get() < -100) x.set(0);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [direction, speed, x]);

  return (
    <div className="flex overflow-hidden whitespace-nowrap opacity-10 select-none pointer-events-none mix-blend-difference">
      <motion.div style={{ x: useMotionTemplate`${x}%` }} className="flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[12vw] font-black leading-none mx-8 uppercase font-mono">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// 5. Skill Card
const SkillCard = ({ name, icon: Icon, level }) => (
  <motion.div 
    whileHover={{ y: -5, backgroundColor: "#111" }}
    className="flex flex-col items-center justify-center p-6 border border-neutral-800 bg-black aspect-square group transition-colors"
  >
    <Icon size={32} className="text-neutral-500 mb-4 group-hover:text-white transition-colors" />
    <span className="font-bold text-sm uppercase tracking-wider">{name}</span>
    <div className="w-full h-1 bg-neutral-900 mt-4 rounded-full overflow-hidden">
      <div className="h-full bg-white" style={{ width: level }}></div>
    </div>
  </motion.div>
);

// 6. Rotating Graphic Element
const RotatingShape = () => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    className="absolute right-0 top-0 opacity-10 pointer-events-none hidden lg:block"
  >
    <svg width="400" height="400" viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="1" fill="none" strokeDasharray="10 10" />
      <rect x="100" y="100" width="200" height="200" stroke="white" strokeWidth="1" fill="none" transform="rotate(45 200 200)" />
    </svg>
  </motion.div>
);

// 7. Custom Cursor
const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-50 mix-blend-difference hidden md:block backdrop-invert"
      style={{ x: mouseX, y: mouseY }}
    >
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
};

// 8. Epic Geometric Triangle
const EpicTriangle = ({ size = 40, className, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M85 20L95 40L75 35L85 20Z" fill="currentColor" fillOpacity="0.4" />
    <path d="M15 30L5 50L25 45L15 30Z" fill="currentColor" fillOpacity="0.4" />
    <path d="M50 85L60 95L40 95L50 85Z" fill="currentColor" fillOpacity="0.4" />
    <path d="M50 10L90 80H10L50 10Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 25L75 70H25L50 25Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M10 60L90 40" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
  </svg>
);

// 9. 3D Logo Component
const ThreeDLogo = () => (
  <motion.div
    style={{ transformStyle: "preserve-3d" }}
    animate={{ rotateY: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    className="relative flex items-center justify-center"
  >
    <EpicTriangle size={32} className="text-white" />
  </motion.div>
);

// --- Constants ---
const WHATSAPP_LINK = "https://wa.me/2348023169274?text=Hello%20Mifimn,%20I%20have%20a%20project%20idea%20I'd%20like%20to%20discuss.";
const EMAIL_ADDRESS = "mailto:shittumifimn0807@gmail.com";
const LINKEDIN_LINK = "https://www.linkedin.com/in/mifimn-shittu";

const App = () => {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/Mifimn/repos?sort=updated&per_page=12')
      .then(res => res.json())
      .then(data => setRepos(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  // Filter repos that have a 'homepage' (Website URL) set on GitHub
  const liveProjects = repos.filter(repo => repo.homepage && repo.homepage.length > 0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black cursor-none md:cursor-auto overflow-x-hidden">
      <CustomCursor />
      <GridBackground />

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50" style={{ scaleX }} />

      {/* Header */}
      <header className="fixed top-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <ThreeDLogo />
          <div className="text-xl font-black tracking-tighter">MIFIMN</div>
        </div>

        {/* Direct Link to Public File */}
        <MagneticButton 
          href="/Mifimn_CV.pdf" 
          download="Mifimn_CV.pdf"
          target="_blank"
          className="border border-white bg-black px-6 py-2 text-xs font-bold hover:bg-white hover:text-black transition-colors flex items-center gap-2"
        >
          <Download size={14} /> CV_V1.0
        </MagneticButton>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden border-b border-neutral-900">
        <RotatingShape />

        <div className="absolute inset-0 flex flex-col justify-center gap-20">
          <Marquee text="DESIGN CODE BUILD" direction={1} speed={2} />
          <Marquee text="MIFIMN CREATIVE" direction={-1} speed={2} />
        </div>

        <div className="z-10 text-center px-4 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 border border-neutral-800 bg-black/50 backdrop-blur px-4 py-1 rounded-full text-xs text-neutral-400"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            OPEN FOR WORK
          </motion.div>

          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-none mix-blend-difference"
          >
            MUSA<br />AYOOLA
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-neutral-400 max-w-md mx-auto font-mono text-sm"
          >
            // FULLSTACK DEVELOPER & UI ARCHITECT<br/>
            Transforming concepts into complex digital realities.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center gap-6"
          >
             <MagneticButton href="https://github.com/Mifimn/" className="p-4 bg-white text-black hover:scale-110 transition-transform">
               <Github size={24} />
             </MagneticButton>
             <MagneticButton href={LINKEDIN_LINK} className="p-4 bg-[#0077b5] text-white hover:scale-110 transition-transform border border-transparent">
               <Linkedin size={24} fill="currentColor" />
             </MagneticButton>
             <MagneticButton href="https://instagram.com/mifimn_01" className="p-4 border border-white hover:bg-white hover:text-black transition-colors">
               <Instagram size={24} />
             </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-neutral-900 bg-neutral-950">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-900">
          {[
            { label: "Experience", value: "3+ Years", icon: Briefcase },
            { label: "Projects", value: "20+ Done", icon: Code2 },
            { label: "Tech Stack", value: "Fullstack", icon: Layers },
            { label: "Location", value: "Nigeria", icon: Globe },
          ].map((stat, i) => (
            <div key={i} className="p-8 flex items-center gap-4 hover:bg-neutral-900 transition-colors">
              <stat.icon className="text-neutral-600" size={24} />
              <div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE ARSENAL */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
           <PenTool size={32} />
           <h2 className="text-4xl md:text-5xl font-black tracking-tighter">THE ARSENAL</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 border-t border-l border-neutral-800">
          <SkillCard name="React" icon={Code2} level="95%" />
          <SkillCard name="Next.js" icon={Monitor} level="90%" />
          <SkillCard name="Tailwind" icon={Palette} level="98%" />
          <SkillCard name="Supabase" icon={Database} level="85%" />
          <SkillCard name="Node.js" icon={Server} level="80%" />
          <SkillCard name="TypeScript" icon={Terminal} level="85%" />
          <SkillCard name="Framer" icon={Zap} level="90%" />
          <SkillCard name="Backend" icon={Cpu} level="75%" />
          <SkillCard name="Mobile" icon={Smartphone} level="70%" />
          <SkillCard name="UI/UX" icon={Box} level="85%" />
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-neutral-950 border-y border-neutral-900">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              <span className="text-neutral-700 block text-2xl mb-2">Capabilities</span>
              WHAT I DO
            </h2>
            <div className="w-full md:w-1/3 text-neutral-400 text-sm font-mono border-l border-neutral-700 pl-4">
              Providing end-to-end digital solutions. From pixel-perfect frontend to robust, scalable backend architecture.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Frontend", desc: "React, Vue, Animations", icon: Monitor },
              { title: "Backend", desc: "Database, API, Auth", icon: Server },
              { title: "Design", desc: "UI Systems, Prototyping", icon: Palette },
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-black border border-neutral-800 p-8 relative overflow-hidden group"
              >
                <service.icon size={48} className="text-neutral-800 mb-6 group-hover:text-white transition-colors" />
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-neutral-500">{service.desc}</p>
                <div className="absolute -right-10 -bottom-10 text-9xl font-black text-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                  0{i+1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 1: LIVE DEPLOYMENTS (Vercel) --- */}
      {liveProjects.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto relative border-t border-neutral-900">
          <div className="flex justify-between items-end mb-16 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500 font-mono text-sm tracking-widest">LIVE SERVERS</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">DEPLOYED<br/>SYSTEMS</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveProjects.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-neutral-900 border border-neutral-800 p-0 flex flex-col justify-between h-[300px] group hover:border-white transition-colors relative overflow-hidden"
              >
                {/* Visual Background Pattern */}
                <ProjectBackground index={i} />

                {/* Content Overlay */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="flex justify-between items-start">
                    <Globe className="text-green-500" />
                    <ArrowUpRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{repo.name}</h3>
                    <p className="text-neutral-400 text-xs font-mono truncate">{repo.homepage.replace(/^https?:\/\//, '')}</p>
                    <div className="mt-4 inline-block bg-green-900/30 border border-green-800 text-green-400 text-[10px] px-2 py-1 rounded">
                      VISIT LIVE SITE
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {/* --- SECTION 2: SOURCE CODE (GitHub) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative border-t border-neutral-900">
        <motion.div style={{ rotate }} className="absolute -left-20 top-20 text-[20rem] opacity-[0.02] font-black pointer-events-none select-none">
          CODE
        </motion.div>

        <div className="flex justify-between items-end mb-16 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-neutral-500">SOURCE<br/>CODE</h2>
          <MagneticButton href="https://github.com/Mifimn" className="hidden md:flex items-center gap-2 border-b border-white pb-1">
             ALL REPOSITORIES <ArrowUpRight size={16} />
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {repos.length > 0 ? repos.map((repo, i) => {
            return (
              <motion.a
                key={repo.id}
                href={repo.html_url} // LINKS TO GITHUB
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative block bg-neutral-900 aspect-[4/3] overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-colors"
              >
                {/* Visual Background Pattern */}
                <ProjectBackground index={i + 5} /> 

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end z-10">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
                      <Terminal size={12} /> {repo.language || "CODE"}
                    </div>
                    <h3 className="text-3xl font-bold mb-2 group-hover:text-white transition-colors">{repo.name}</h3>
                    <p className="text-neutral-400 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {repo.description || "High-performance web application engineered by Mifimn."}
                    </p>
                  </div>
                </div>
              </motion.a>
            );
          }) : (
            <div className="col-span-2 text-center py-20 border border-dashed border-neutral-800">
              <div className="animate-spin inline-block mr-2"><Box size={20}/></div>
              Retrieving GitHub Data...
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center px-6 text-center border-t border-neutral-900 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-neutral-800 rounded-full" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-neutral-800 rounded-full" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-neutral-800 rounded-full" />
        </div>

        <div className="relative z-10">
          <Award size={48} className="mx-auto mb-6 text-white" />
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">
            READY TO<br/>COLLABORATE?
          </h2>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <MagneticButton 
              href={WHATSAPP_LINK}
              className="bg-white text-black text-lg font-bold px-8 py-4 hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Smartphone size={20} /> WHATSAPP
            </MagneticButton>
            <MagneticButton 
              href={EMAIL_ADDRESS}
              className="border border-neutral-700 bg-black text-white text-lg font-bold px-8 py-4 hover:bg-neutral-900 transition-colors flex items-center gap-2"
            >
              <Mail size={20} /> SEND EMAIL
            </MagneticButton>
             {/* FOOTER LINKEDIN BUTTON */}
             <MagneticButton href={LINKEDIN_LINK} className="p-4 bg-[#0077b5] text-white hover:scale-110 transition-transform rounded-full">
               <Linkedin size={24} fill="currentColor" />
             </MagneticButton>
          </div>
        </div>

        <footer className="absolute bottom-6 w-full px-6 flex justify-between items-center text-xs font-mono text-neutral-600 uppercase">
          <span>© 2025 Mifimn Brand</span>
          <span>Made in Nigeria</span>
        </footer>
      </section>
    </div>
  );
};

export default App;