import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import imageCompression from 'browser-image-compression'
import './App.css'
import { supabase } from './supabaseClient.js'
import truck1 from './assets/truck1.png'
import truck2 from './assets/truck2.png'
import truck3 from './assets/truck3.png'

const quarryImage =
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85'

type Material = {
  id: string
  title: string
  description: string
  image_url: string | string[] | null
}

type MaterialForm = {
  title: string
  description: string
  images: File[]
}

const ADMIN_EMAIL = 'sheshanktransport777@gmail.com'

function getMaterialImages(imageUrl: string | string[] | null | undefined) {
  if (!imageUrl) return []
  if (Array.isArray(imageUrl)) return imageUrl
  try {
    const parsed: unknown = JSON.parse(imageUrl)
    if (Array.isArray(parsed)) return parsed.filter((url): url is string => typeof url === 'string' && url.length > 0)
    if (typeof parsed === 'string' && parsed !== imageUrl) return getMaterialImages(parsed)
  } catch {
    // Older materials store one URL as plain text.
  }
  return [imageUrl]
}

async function fetchMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('id, title, description, image_url')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Material[]
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTruck, setActiveTruck] = useState(0)
  const [homeMaterials, setHomeMaterials] = useState<Material[]>([])
  const [materialsError, setMaterialsError] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const touchStartX = useRef<number | null>(null)
  const words = ['Building', 'Dreams.', 'Delivering', 'Strength.']
  const truckImages = [truck1, truck2, truck3]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTruck((current) => (current + 1) % truckImages.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [truckImages.length])

  useEffect(() => {
    let active = true
    fetchMaterials()
      .then((items) => {
        if (active) setHomeMaterials(items)
      })
      .catch(() => {
        if (active) setMaterialsError('Materials are temporarily unavailable.')
      })
    return () => {
      active = false
    }
  }, [])

  function openMaterial(material: Material) {
    setSelectedMaterial(material)
    setSelectedImageIndex(0)
  }

  function closeMaterial(event?: React.MouseEvent) {
    event?.stopPropagation()
    setFullscreenImage(null)
    setSelectedMaterial(null)
  }

  function closeFullscreenImage(event: React.MouseEvent) {
    event.stopPropagation()
    setFullscreenImage(null)
  }

  return <div className="site-shell home-redesign">
    <header className="premium-header">
      <Link className="premium-brand" to="/"><span className="brand-mark"><Truck size={18} /></span><span>SHESHANK <b>TRANSPORT</b></span></Link>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      <nav className={menuOpen ? 'premium-nav open' : 'premium-nav'}><Link className="active" to="/">HOME</Link><Link to="/about">ABOUT US</Link><Link to="/contact">CONTACT</Link><Link className="premium-cta" to="/contact">GET A QUOTE <ArrowUpRight size={14} /></Link></nav>
    </header>
    <main>
      <section className="premium-hero">
        <div className="hero-grid-pattern" />
        <div className="premium-hero-copy">
          <motion.div className="eyebrow orange-label" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6 }}><span /> GOA'S MATERIALS &amp; LOGISTICS PARTNER</motion.div>
          <h1>{words.map((word, index) => <motion.span key={word} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + index * .13, duration: .7, ease: [.22, 1, .36, 1] }}>{word}{index < words.length - 1 ? ' ' : ''}</motion.span>)}</h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}>Certified construction materials. Modern heavy fleet.<br />Delivered with precision across North &amp; South Goa.</motion.p>
          <motion.div className="premium-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}><a className="premium-orange-button" href="https://wa.me/919823463824" target="_blank" rel="noreferrer">CHAT ON WHATSAPP <ArrowUpRight size={16} /></a></motion.div>
        </div>
        <motion.div className="truck-illustration" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: .35, duration: 1.15, ease: [.22, 1, .36, 1] }}>
          <div className="truck-glow" />
          <div className="truck-image-frame">
            {truckImages.map((image, index) => <img className={index === activeTruck ? 'truck-slide active' : 'truck-slide'} key={image} src={image} alt={`Sheshank Transport fleet view ${index + 1}`} />)}
            <div className="truck-slide-dots">{truckImages.map((image, index) => <button className={index === activeTruck ? 'active' : ''} key={image} onClick={() => setActiveTruck(index)} aria-label={`Show fleet image ${index + 1}`} />)}</div>
          </div>
        </motion.div>
        <div className="hero-stamp">EST. 2014 <span /> GOA, INDIA</div>
      </section>
      <div className="marquee"><div>FAST DELIVERY <span>•</span> PREMIUM LATERITE <span>•</span> GOA WIDE SERVICE <span>•</span> JCB EXCAVATION <span>•</span> HEAVY TRANSPORT <span>•</span> FAST DELIVERY <span>•</span> PREMIUM LATERITE <span>•</span></div></div>
      <section className="premium-materials" id="materials">
        <div className="premium-section-heading"><div><div className="eyebrow"><span /> SOURCED. LOADED. DELIVERED.</div><h2>OUR <em>MATERIALS</em></h2></div><Link to="/contact">VIEW ALL MATERIALS <ArrowUpRight size={15} /></Link></div>
        <motion.div className="materials-search hero-search" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>{<Search size={19} />}<input placeholder="What are you building today? Search materials..." /><Link to="/contact">FIND MATERIALS <ArrowUpRight size={14} /></Link></motion.div>
        <motion.div className="premium-material-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={{ visible: { transition: { staggerChildren: .12 } } }}>
          {homeMaterials.map((material) => <motion.article className="premium-card" key={material.id} variants={{ hidden: { opacity: 0, y: 45 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: .55 }} whileHover={{ scale: 1.02, y: -5 }} onClick={() => openMaterial(material)}><div className="premium-card-image"><img src={getMaterialImages(material.image_url)[0] || quarryImage} alt={material.title} /><span>MATERIAL</span></div><div className="premium-card-body"><h3>{material.title}</h3><p>{material.description}</p><button className="material-details-button" type="button" aria-label={`View details for ${material.title}`} onClick={(event) => { event.stopPropagation(); openMaterial(material) }}><ArrowUpRight size={17} /></button></div></motion.article>)}
        </motion.div>
        {materialsError && <p className="materials-error">{materialsError}</p>}
        {!materialsError && homeMaterials.length === 0 && <p className="materials-empty">No materials are available yet.</p>}
      </section>
    </main>
    <AnimatePresence>
      {selectedMaterial && (() => {
        const images = getMaterialImages(selectedMaterial.image_url)
        const activeImage = images[selectedImageIndex] || images[0] || quarryImage
        const whatsappMessage = encodeURIComponent(`I'm interested in ${selectedMaterial.title}`)
        const showPreviousImage = () => setSelectedImageIndex((index) => (index - 1 + images.length) % images.length)
        const showNextImage = () => setSelectedImageIndex((index) => (index + 1) % images.length)
        const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
          touchStartX.current = event.touches[0]?.clientX ?? null
        }
        const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
          if (touchStartX.current === null || images.length < 2) return
          const endX = event.changedTouches[0]?.clientX
          if (endX === undefined) return
          const distance = endX - touchStartX.current
          touchStartX.current = null
          if (Math.abs(distance) < 40) return
          if (distance < 0) showNextImage()
          else showPreviousImage()
        }
        return <motion.div className="material-modal-overlay" role="dialog" aria-modal="true" aria-label={`${selectedMaterial.title} details`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMaterial}>
          <motion.div className="material-modal" initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .96 }} transition={{ duration: .25 }} onClick={(event) => event.stopPropagation()}>
            <button className="material-modal-close" type="button" aria-label="Close material details" onClick={closeMaterial}><X size={20} /></button>
            <div className="material-modal-gallery" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}><div className="material-modal-image-stage"><button className="material-modal-image-button" type="button" aria-label={`View ${selectedMaterial.title} image fullscreen`} onClick={() => setFullscreenImage(activeImage)}><img className="material-modal-main-image" src={activeImage} alt={`${selectedMaterial.title} view ${selectedImageIndex + 1}`} /></button>{images.length > 1 && <><button className="material-modal-image-arrow previous" type="button" aria-label="Previous material image" onClick={showPreviousImage}><ChevronLeft size={22} /></button><button className="material-modal-image-arrow next" type="button" aria-label="Next material image" onClick={showNextImage}><ChevronRight size={22} /></button><span className="material-modal-image-count">{selectedImageIndex + 1} / {images.length}</span></>}</div>{images.length > 1 && <div className="material-modal-thumbnails">{images.map((image, index) => <button type="button" className={index === selectedImageIndex ? 'active' : ''} key={`${image}-${index}`} onClick={() => { setSelectedImageIndex(index); setFullscreenImage(image) }}><img src={image} alt={`${selectedMaterial.title} view ${index + 1}`} /></button>)}</div>}</div>
            <div className="material-modal-content"><div className="eyebrow"><span /> CONSTRUCTION MATERIAL</div><h2>{selectedMaterial.title}</h2><p>{selectedMaterial.description || 'Contact us to discuss availability, pricing and delivery for this material.'}</p><div className="material-order"><h3>CONTACT FOR ORDER</h3><a className="material-contact whatsapp-contact" href={`https://wa.me/919823463824?text=${whatsappMessage}`} target="_blank" rel="noreferrer">WHATSAPP <span>CHAT NOW</span><ArrowUpRight size={16} /></a><a className="material-contact phone-contact" href="tel:+919823463824">PHONE <span>+91 98234 63824</span><ArrowUpRight size={16} /></a><a className="material-contact email-contact" href="mailto:sheshanktransport777@gmail.com">GMAIL <span>EMAIL US</span><ArrowUpRight size={16} /></a></div></div>
          </motion.div>
        </motion.div>
      })()}
    </AnimatePresence>
    <AnimatePresence>
      {fullscreenImage && <motion.div className="fullscreen-image-overlay" role="dialog" aria-modal="true" aria-label="Fullscreen material image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeFullscreenImage}><motion.img className="fullscreen-image" src={fullscreenImage} alt="Fullscreen material" initial={{ scale: .92 }} animate={{ scale: 1 }} exit={{ scale: .92 }} onClick={(event) => event.stopPropagation()} /><button className="fullscreen-image-close" type="button" aria-label="Close fullscreen image" onClick={closeFullscreenImage}><X size={24} /></button></motion.div>}
    </AnimatePresence>
    <AboutFooter />
  </div>
}

function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <header className="premium-header">
        <Link className="premium-brand" to="/" aria-label="Sheshank Transport home"><span className="brand-mark"><Truck size={18} /></span><span>SHESHANK <b>TRANSPORT</b></span></Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={menuOpen ? 'premium-nav open' : 'premium-nav'}>
          <Link to="/">HOME</Link><Link className="active" to="/about">ABOUT US</Link><Link to="/contact">CONTACT</Link><Link className="premium-cta" to="/contact">GET A QUOTE <ArrowUpRight size={14} /></Link>
        </nav>
      </header>

      <main className="about-page">
        <section className="about-hero" style={{ backgroundImage: `url(${truck1})` }}>
          <div className="hero-overlay" />
          <div className="about-hero-content">
            <div className="eyebrow light"><span /> INFRASTRUCTURE LOGISTICS · GOA</div>
            <h1>ABOUT SHESHANK TRANSPORT</h1>
            <p>Reliable Material Supply &amp; Heavy Fleet Logistics Rooted in Goa</p>
          </div>
        </section>

        <section className="story-section">
          <div className="story-copy">
            <div className="eyebrow"><span /> ABOUT THE BUSINESS · GOA, INDIA</div>
            <h2>CONSTRUCTION MATERIALS,<br />DELIVERED TO SITE.</h2>
            <p>Sheshank Transport is a Goa-based construction material supply and transportation business. We help homeowners, builders, contractors, construction companies, real estate developers and infrastructure projects source the materials they need and arrange delivery directly to their site.</p>
            <p className="small-copy">From sand and laterite stones to rubble, gravel and aggregates, customers can discuss their material type, quantity, pricing and delivery requirements with one dependable local team.</p>
            <div className="story-points"><div><Truck size={14} /><b>MATERIAL SUPPLY</b><span>Sand, stones, gravel and aggregates</span></div><div><MapPin size={14} /><b>GOA DELIVERY</b><span>Materials transported to construction sites</span></div></div>
          </div>
          <div className="story-image"><img src={truck3} alt="Sheshank Transport construction material operations" /><div><b>CONSTRUCTION MATERIALS</b><strong>Sand, laterite, rubble, gravel and aggregates for Goa projects</strong></div></div>
        </section>

        <section className="advantages-section">
          <div className="eyebrow">WHO WE SERVE</div><h2>BUILT AROUND YOUR PROJECT</h2>
          <div className="advantage-grid">
            {[
              ['⌂', 'HOMEOWNERS', 'Material supply and delivery support for residential construction and renovation projects.'],
              ['▣', 'BUILDERS & CONTRACTORS', 'A practical source for regular material requirements and site deliveries.'],
              ['◆', 'DEVELOPERS', 'Construction material coordination for real estate and commercial projects.'],
              ['●', 'INFRASTRUCTURE PROJECTS', 'Supply and transportation support for larger civil and infrastructure work.'],
            ].map(([icon, title, copy]) => <article key={title}><span className="advantage-icon">{icon}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="dispatch-banner"><div><div className="eyebrow">HOW IT WORKS</div><h2>FROM YOUR ENQUIRY TO SITE DELIVERY.</h2><p>Contact us, confirm the material and quantity, discuss pricing and delivery, arrange transportation, and receive the order at your construction site.</p></div><div><a className="orange-button" href="tel:+919823463824">☎ &nbsp; +91 98234 63824</a><a className="dark-button" href="https://wa.me/919823463824">▣ &nbsp; CHAT ON WHATSAPP</a></div></section>
        <div className="about-admin-link"><Link to="/admin/login">ADMIN LOGIN</Link></div>
      </main>
      <AboutFooter />
    </div>
  )
}

function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <header className="premium-header">
        <Link className="premium-brand" to="/" aria-label="Sheshank Transport home"><span className="brand-mark"><Truck size={18} /></span><span>SHESHANK <b>TRANSPORT</b></span></Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={menuOpen ? 'premium-nav open' : 'premium-nav'}>
          <Link to="/">HOME</Link><Link to="/about">ABOUT US</Link><Link className="active" to="/contact">CONTACT</Link><Link className="premium-cta" to="/contact">GET A QUOTE <ArrowUpRight size={14} /></Link>
        </nav>
      </header>

      <main className="contact-page">
        <section className="contact-intro">
          <div className="eyebrow"><span /> SHESHANK TRANSPORT · GOA, INDIA</div>
          <h1>LET'S PLAN YOUR<br />MATERIAL DELIVERY.</h1>
          <p>Tell us what construction material you need, the quantity, and where it should be delivered. We will discuss pricing and transportation details with you.</p>
        </section>

        <section className="route-banner">
          <img src={truck2} alt="Sheshank Transport truck at a quarry" />
          <div className="route-caption"><b>▣ &nbsp; CONSTRUCTION MATERIAL SUPPLY &amp; TRANSPORTATION ACROSS GOA</b><span>Sand &amp;<br />Stones</span><span>Gravel &amp;<br />Aggregates</span><span>Site<br />Delivery</span></div>
        </section>

        <section className="contact-workspace">
          <div className="channel-column">
            <div className="eyebrow">DIRECT CHANNELS</div>
            <div className="whatsapp-card"><div className="channel-top"><span className="channel-icon green"><MessageIcon /></span><b>DIRECT ENQUIRY</b></div><h3>CHAT ABOUT YOUR MATERIALS</h3><p>Send the material name, required quantity and site location for a quick conversation about your order.</p><a className="whatsapp-large" href="https://wa.me/919823463824">▣ &nbsp; CHAT ON WHATSAPP</a></div>
            <div className="contact-card"><span className="round-gray"><Phone size={15} /></span><div><small>PHONE</small><strong>+91 98234 63824</strong><p>Call to discuss material requirements, pricing and delivery.</p></div></div>
            <div className="contact-card"><span className="round-gray"><Mail size={15} /></span><div><small>EMAIL</small><strong>sheshanktransport777@gmail.com</strong><p>Send your project or material enquiry by email.</p></div></div>
            <div className="contact-card"><span className="round-gray orange-icon"><MapPin size={15} /></span><div><small>LOCATION</small><strong>Goa, India</strong><p>Construction material supply and transportation for customers in Goa.</p></div></div>
            <div className="coverage-card"><div><b>BUSINESS OPERATIONS</b><em>GOA, INDIA</em></div><a className="map-link" href="https://share.google/8NLYxhWBAdM0RB8BG" target="_blank" rel="noreferrer" aria-label="Open Sheshank Transport location in Google Maps"><div className="map-placeholder"><span>SHESHANK TRANSPORT</span><i>●</i><small>MATERIAL SUPPLY &amp; TRANSPORTATION <b>OPEN MAP</b></small></div></a><div className="sector-row"><span><b>WE SUPPLY</b><br />Sand · Laterite · Rubble · Gravel</span><span><b>WE ARRANGE</b><br />Vehicles · Delivery · Order support</span></div></div>
          </div>

        </section>
      </main>
      <AboutFooter />
    </div>
  )
}

function MessageIcon() {
  return <span style={{ fontSize: 16 }}>▣</span>
}

function AboutFooter() {
  return <footer id="contact"><div className="footer-main"><div className="footer-brand"><Link className="brand" to="/"><span className="brand-mark"><Truck size={18} /></span><span>SHESHANK TRANSPORT</span></Link><h3>CONSTRUCTION MATERIALS <em>DELIVERED.</em></h3><p>Goa-based construction material supply and transportation for homes, builders, contractors, developers and infrastructure projects.</p></div><div><h4>NAVIGATION</h4><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/contact">Contact Us</Link><Link to="/contact">Material Enquiry</Link></div><div><h4>CONTACT DETAILS</h4><p><Phone size={12} /> +91 98234 63824</p><p><Mail size={12} /> sheshanktransport777@gmail.com</p><p><MapPin size={12} /> Goa, India</p><a className="whatsapp" href="https://wa.me/919823463824"><Clock3 size={13} /> CHAT ON WHATSAPP</a></div></div><div className="footer-bottom"><span>© 2025 Sheshank Transport. Construction Material Supply &amp; Transportation, Goa.</span><b>GOA, INDIA</b></div></footer>
}

function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate('/admin/dashboard', { replace: true })
  }

  return <main className="admin-page admin-login-page"><form className="admin-form" onSubmit={handleSubmit}><div className="eyebrow"><span /> SHESHANK TRANSPORT</div><h1>ADMIN LOGIN</h1><p>Enter the admin password to manage materials shown on the public website.</p><label>Password<span className="password-input-wrap"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>{error && <p className="admin-error" role="alert">{error}</p>}<button className="admin-primary-button" type="submit" disabled={loading}>{loading ? 'SIGNING IN...' : 'SIGN IN'}</button><Link className="admin-back-link" to="/">Back to website</Link></form></main>
}

function ProtectedDashboard() {
  const [sessionReady, setSessionReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setAuthenticated(Boolean(data.session))
        setSessionReady(true)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAuthenticated(Boolean(session))
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!sessionReady) return <main className="admin-page"><p className="admin-loading">Checking session...</p></main>
  return authenticated ? <AdminDashboardPage /> : <Navigate to="/admin/login" replace />
}

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [materialsList, setMaterialsList] = useState<Material[]>([])
  const [form, setForm] = useState<MaterialForm>({ title: '', description: '', images: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '' })
  const [savingEdit, setSavingEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadMaterials() {
    setLoading(true)
    const result = await fetchMaterials()
    setMaterialsList(result)
    setLoading(false)
  }

  useEffect(() => {
    loadMaterials().catch(() => {
      setError('Unable to load materials.')
      setLoading(false)
    })
  }, [])

  async function handleAddMaterial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (form.images.length === 0) {
      setError('Please choose at least one image.')
      window.alert('Please choose at least one image.')
      return
    }
    setError('')
    setMessage('')
    setSubmitting(true)
    const uploadedPaths: string[] = []
    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true, fileType: 'image/jpeg' as const }
      const imageUrls: string[] = []
      for (const image of form.images) {
        const compressedFile = await imageCompression(image, options)
        const baseName = image.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-')
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
        const filePath = `${uniqueFileName}-${baseName || 'material'}.jpg`
        const upload = await supabase.storage.from('material-photos').upload(filePath, compressedFile, { upsert: false, contentType: 'image/jpeg' })
        if (upload.error) throw upload.error
        uploadedPaths.push(filePath)
        const { data: publicUrl } = supabase.storage.from('material-photos').getPublicUrl(filePath)
        imageUrls.push(publicUrl.publicUrl)
      }

      const insert = await supabase.from('materials').insert({ title: form.title, description: form.description, image_url: JSON.stringify(imageUrls) }).select('id, title, description, image_url').single()
      if (insert.error) {
        throw insert.error
      }

      setMaterialsList((current) => [insert.data as Material, ...current])
      setForm({ title: '', description: '', images: [] })
      const fileInput = document.getElementById('material-image') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
      setMessage('Material added successfully.')
    } catch (caughtError) {
      if (uploadedPaths.length > 0) await supabase.storage.from('material-photos').remove(uploadedPaths)
      const message = caughtError instanceof Error ? caughtError.message : String(caughtError)
      setError(message)
      window.alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setError('')
    const { error: deleteError } = await supabase.from('materials').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setMaterialsList((current) => current.filter((material) => material.id !== id))
  }

  function startEditing(material: Material) {
    setEditingId(material.id)
    setEditForm({ title: material.title, description: material.description ?? '' })
    setError('')
    setMessage('')
  }

  async function handleEditMaterial(event: React.FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSavingEdit(true)
    try {
      const { data, error: updateError } = await supabase
        .from('materials')
        .update({ title: editForm.title, description: editForm.description })
        .eq('id', id)
        .select('id, title, description, image_url')
        .single()
      if (updateError) throw updateError
      setMaterialsList((current) => current.map((material) => material.id === id ? data as Material : material))
      setEditingId(null)
      setMessage('Material updated successfully.')
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : String(caughtError)
      setError(message)
      window.alert(message)
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return <main className="admin-page admin-dashboard-page"><div className="admin-dashboard-header"><div><div className="eyebrow"><span /> SHESHANK TRANSPORT</div><h1>MATERIALS ADMIN</h1></div><button className="admin-logout-button" onClick={handleLogout}>LOG OUT</button></div><form className="admin-form admin-material-form" onSubmit={handleAddMaterial}><h2>ADD MATERIAL</h2><label>Title<input type="text" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label><label>Description <span className="admin-optional-label">(optional)</span><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label>Images <span className="admin-optional-label">(select multiple)</span><input id="material-image" type="file" accept="image/*" multiple onChange={(event) => setForm({ ...form, images: Array.from(event.target.files ?? []) })} required /></label>{error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="admin-success" role="status">{message}</p>}<button className="admin-primary-button" type="submit" disabled={submitting}>{submitting ? 'UPLOADING...' : 'ADD MATERIAL'}</button></form><section className="admin-materials-list"><h2>ALL MATERIALS</h2>{loading ? <p className="admin-loading">Loading materials...</p> : materialsList.length === 0 ? <p className="admin-loading">No materials added yet.</p> : <div className="admin-material-grid">{materialsList.map((material) => <article className="admin-material-card" key={material.id}><div className="admin-material-gallery">{getMaterialImages(material.image_url).map((imageUrl) => <img src={imageUrl} alt={material.title} key={imageUrl} />)}</div><div>{editingId === material.id ? <form className="admin-edit-form" onSubmit={(event) => handleEditMaterial(event, material.id)}><label>Title<input value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} required /></label><label>Description <span className="admin-optional-label">(optional)</span><textarea value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} /></label><div className="admin-card-actions"><button className="admin-primary-button" type="submit" disabled={savingEdit}>{savingEdit ? 'SAVING...' : 'SAVE'}</button><button className="admin-cancel-button" type="button" onClick={() => setEditingId(null)}>CANCEL</button></div></form> : <><h3>{material.title}</h3><p>{material.description}</p><div className="admin-card-actions"><button className="admin-edit-button" type="button" onClick={() => startEditing(material)}>EDIT</button><button className="admin-delete-button" type="button" onClick={() => handleDelete(material.id)}>DELETE</button></div></>}</div></article>)}</div>}</section></main>
}

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/admin/login" element={<AdminLoginPage />} /><Route path="/admin/dashboard" element={<ProtectedDashboard />} /></Routes></BrowserRouter>
}

export default App
