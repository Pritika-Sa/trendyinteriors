import React, { useState, useEffect, useCallback } from 'react';
import {
    FaTrash, FaPlus, FaEdit, FaTimes, FaCheck,
    FaProjectDiagram, FaComments, FaUsers, FaCog, FaPhone, FaWhatsapp, FaPalette
} from 'react-icons/fa';
import './AdminDashboard.css';
import AdminNavigation from './components/AdminNavigation';
import FormCard from './components/FormCard';
import DragDropUpload from './components/DragDropUpload';
import MultiImageUpload from './components/MultiImageUpload';
import Toast from './components/Toast';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Projects State
    const [projects, setProjects] = useState([]);
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        category: '',
        image: '',
        images: []
    });
    const [editingProjectId, setEditingProjectId] = useState(null);

    // Testimonials State
    const [testimonials, setTestimonials] = useState([]);

    // Contacts State
    const [contacts, setContacts] = useState([]);

    // Team Members State
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamForm, setTeamForm] = useState({
        name: '',
        role: '',
        image: '',
        mobilePhone: '',
        linkedin: '',
        instagram: '',
        twitter: '',
        order: 0
    });
    const [editingTeamId, setEditingTeamId] = useState(null);

    // Services State
    const [services, setServices] = useState([]);
    const [serviceForm, setServiceForm] = useState({
        title: '',
        description: '',
        icon: '',
        order: 0
    });
    const [editingServiceId, setEditingServiceId] = useState(null);

    // Designs State
    const [designs, setDesigns] = useState([]);
    const [designForm, setDesignForm] = useState({
        title: '',
        imageUrl: '',
        description: '',
        order: 0
    });
    const [editingDesignId, setEditingDesignId] = useState(null);

    // Delete Confirmation Modal State
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        itemType: '', // 'testimonial', 'project', etc
        itemId: '',
        itemName: '',
        isLoading: false
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    // ============ FETCH ALL DATA ============
    const fetchProjects = async () => {
        try {
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/projects');
            const data = await response.json();
            if (!response.ok) {
                console.error('Error fetching projects:', data.message || 'Unknown error');
                setProjects([]);
                return;
            }
            if (data.success) setProjects(data.data || []);
            else setProjects([]);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        }
    };

    const fetchTestimonials = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No auth token found');
                setTestimonials([]);
                return;
            }
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/testimonials/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Error fetching testimonials:', response.status, data.error || data.message);
                setTestimonials([]);
                return;
            }
            if (data.success) setTestimonials(data.data || []);
            else setTestimonials([]);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setTestimonials([]);
        }
    };

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No auth token found');
                setContacts([]);
                return;
            }
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/contacts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Error fetching contacts:', response.status, data.error || data.message);
                setContacts([]);
                return;
            }
            if (data.success) setContacts(data.data || []);
            else setContacts([]);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setContacts([]);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/team-members');
            const data = await response.json();
            if (!response.ok) {
                console.error('Error fetching team members:', response.status, data.message);
                setTeamMembers([]);
                return;
            }
            if (data.success) setTeamMembers(data.data || []);
            else setTeamMembers([]);
        } catch (error) {
            console.error('Error fetching team members:', error);
            setTeamMembers([]);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/services');
            const data = await response.json();
            if (!response.ok) {
                console.error('Error fetching services:', response.status, data.message);
                setServices([]);
                return;
            }
            if (data.success) setServices(data.data || []);
            else setServices([]);
        } catch (error) {
            console.error('Error fetching services:', error);
            setServices([]);
        }
    };

    const fetchDesigns = async () => {
        try {
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/designs');
            const data = await response.json();
            if (!response.ok) {
                console.error('Error fetching designs:', response.status, data.message);
                setDesigns([]);
                return;
            }
            if (data.success) setDesigns(data.data || []);
            else setDesigns([]);
        } catch (error) {
            console.error('Error fetching designs:', error);
            setDesigns([]);
        }
    };

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchProjects(),
            fetchTestimonials(),
            fetchContacts(),
            fetchTeamMembers(),
            fetchServices(),
            fetchDesigns()
        ]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // ============ PROJECTS FUNCTIONS ============

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingProjectId
                ? `https://trendyinteriors-1.onrender.com/api/projects/${editingProjectId}`
                : 'https://trendyinteriors-1.onrender.com/api/projects';
            const method = editingProjectId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(projectForm)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to save project');

            showToast(editingProjectId ? 'Project updated successfully!' : 'Project published successfully!', 'success');
            setProjectForm({ title: '', description: '', category: '', image: '', images: [] });
            setEditingProjectId(null);
            fetchProjects();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitLoading(false);
        }
    };



    const handleProjectEdit = (project) => {
        setProjectForm({
            title: project.title,
            description: project.description,
            category: project.category,
            image: project.image,
            images: project.images || []
        });
        setEditingProjectId(project._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleProjectDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete');
            showToast('Project deleted successfully!', 'success');
            fetchProjects();
        } catch (error) {
            showToast('Failed to delete project', 'error');
        }
    };

    // ============ TESTIMONIALS FUNCTIONS ============

    const handleTestimonialApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/testimonials/${id}/approve`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            showToast('Testimonial published successfully!', 'success');
            fetchTestimonials();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleTestimonialDeny = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/testimonials/${id}/deny`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            showToast('Testimonial unpublished successfully!', 'success');
            fetchTestimonials();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleTestimonialDelete = (id, name) => {
        setDeleteModal({
            isOpen: true,
            itemType: 'testimonial',
            itemId: id,
            itemName: name,
            isLoading: false
        });
    };

    const confirmTestimonialDelete = async () => {
        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/testimonials/${deleteModal.itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete');
            showToast('Testimonial deleted successfully!', 'success');
            setDeleteModal({ isOpen: false, itemType: '', itemId: '', itemName: '', isLoading: false });
            fetchTestimonials();
        } catch (error) {
            showToast('Failed to delete testimonial', 'error');
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    // ============ TEAM MEMBERS FUNCTIONS ============

    const handleTeamSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingTeamId
                ? `https://trendyinteriors-1.onrender.com/api/team-members/${editingTeamId}`
                : 'https://trendyinteriors-1.onrender.com/api/team-members';
            const method = editingTeamId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(teamForm)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to save team member');

            showToast(editingTeamId ? 'Team member updated!' : 'Team member added!', 'success');
            setTeamForm({ name: '', role: '', image: '', mobilePhone: '', linkedin: '', instagram: '', twitter: '', order: 0 });
            setEditingTeamId(null);
            fetchTeamMembers();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleTeamEdit = (member) => {
        setTeamForm({
            name: member.name,
            role: member.role,
            image: member.image,
            mobilePhone: member.mobilePhone,
            linkedin: member.linkedin,
            instagram: member.instagram,
            twitter: member.twitter,
            order: member.order
        });
        setEditingTeamId(member._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTeamDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/team-members/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete');
            showToast('Team member deleted successfully!', 'success');
            fetchTeamMembers();
        } catch (error) {
            showToast('Failed to delete team member', 'error');
        }
    };

    // ============ SERVICES FUNCTIONS ============

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingServiceId
                ? `https://trendyinteriors-1.onrender.com/api/services/${editingServiceId}`
                : 'https://trendyinteriors-1.onrender.com/api/services';
            const method = editingServiceId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceForm)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to save service');

            showToast(editingServiceId ? 'Service updated!' : 'Service added!', 'success');
            setServiceForm({ title: '', description: '', icon: '', order: 0 });
            setEditingServiceId(null);
            fetchServices();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleServiceEdit = (service) => {
        setServiceForm({
            title: service.title,
            description: service.description,
            icon: service.icon,
            order: service.order
        });
        setEditingServiceId(service._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleServiceDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete');
            showToast('Service deleted successfully!', 'success');
            fetchServices();
        } catch (error) {
            showToast('Failed to delete service', 'error');
        }
    };

    // ============ DESIGNS FUNCTIONS ============

    const handleDesignSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingDesignId
                ? `https://trendyinteriors-1.onrender.com/api/designs/${editingDesignId}`
                : 'https://trendyinteriors-1.onrender.com/api/designs';
            const method = editingDesignId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(designForm)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to save design');

            showToast(editingDesignId ? 'Design updated!' : 'Design added!', 'success');
            setDesignForm({ title: '', imageUrl: '', description: '', order: 0 });
            setEditingDesignId(null);
            fetchDesigns();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDesignEdit = (design) => {
        setDesignForm({
            title: design.title,
            imageUrl: design.imageUrl,
            description: design.description,
            order: design.order
        });
        setEditingDesignId(design._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDesignDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this design?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/designs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete');
            showToast('Design deleted successfully!', 'success');
            fetchDesigns();
        } catch (error) {
            showToast('Failed to delete design', 'error');
        }
    };

    const cancelEdit = () => {
        setProjectForm({ title: '', description: '', category: '', image: '', images: [] });
        setTeamForm({ name: '', role: '', image: '', mobilePhone: '', linkedin: '', instagram: '', twitter: '', order: 0 });
        setServiceForm({ title: '', description: '', icon: '', order: 0 });
        setDesignForm({ title: '', imageUrl: '', description: '', order: 0 });
        setEditingProjectId(null);
        setEditingTeamId(null);
        setEditingServiceId(null);
        setEditingDesignId(null);
    };

    // ============ CONTACTS FUNCTIONS ============

const DEFAULT_WHATSAPP_MESSAGE = `Hello!

Thank you for contacting Trendy Interiors.

We have received your message and truly appreciate your interest in our interior design services. Our team will review your requirements and get back to you shortly.

If you have any additional details about your project, please feel free to share them with us.

We look forward to transforming your space!`;
    const handleWhatsAppReply = async (contact) => {
        // Mark as read
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No auth token found');
                return;
            }
            
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/contacts/${contact._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'replied' })
            });
            
            if (!response.ok) {
                console.error('Error updating contact status:', response.status);
            }
        } catch (error) {
            console.error('Error updating contact status:', error);
        }

        // Open WhatsApp with pre-filled message
        const phoneNumber = contact.mobileNumber.replace(/\D/g, '').slice(-10);
        const encodedMessage = encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE);
        const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleContactDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Authentication error: Please log in again', 'error');
                return;
            }
            
            const response = await fetch(`https://trendyinteriors-1.onrender.com/api/contacts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to delete contact');
            }
            
            showToast('Contact deleted successfully!', 'success');
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
            showToast(`Failed to delete contact: ${error.message}`, 'error');
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="admin-dashboard-content">
                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                    <div className="admin-section-wrapper">
                        <div className="form-section">
                            <FormCard
                                title={editingProjectId ? 'Update Project' : 'Publish New Project'}
                                icon={editingProjectId ? <FaEdit /> : <FaPlus />}
                            >
                                <form onSubmit={handleProjectSubmit} className="admin-form">
                                    <div className="form-subsection">
                                        <h4 className="subsection-title">Project Information</h4>
                                        <div className="form-group">
                                            <label htmlFor="project-title">Project Title <span className="required">*</span></label>
                                            <input
                                                id="project-title"
                                                type="text"
                                                value={projectForm.title}
                                                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                                required
                                                placeholder="e.g. Luxury Apartment in Chennai"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="project-description">Description / Location <span className="required">*</span></label>
                                            <textarea
                                                id="project-description"
                                                value={projectForm.description}
                                                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                                required
                                                rows="4"
                                                placeholder="Describe the project, location, key features..."
                                                className="form-textarea"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="form-subsection">
                                        <h4 className="subsection-title">Category <span className="required">*</span></h4>
                                        <select
                                            value={projectForm.category}
                                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                                            required
                                            className="form-input"
                                        >
                                            <option value="">-- Select a category --</option>
                                            <option value="residential">Residential</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="art-craft">Art & Craft</option>
                                        </select>
                                    </div>

                                    <div className="form-subsection">
                                        <h4 className="subsection-title">Project Image <span className="required">*</span></h4>
                                        <DragDropUpload
                                            imageUrl={projectForm.image}
                                            onImageUrlChange={(url) => setProjectForm({ ...projectForm, image: url })}
                                            label="Project Image"
                                        />
                                    </div>

                                    <div className="form-subsection">
                                        <h4 className="subsection-title">Project Gallery Images (Optional)</h4>
                                        <p className="subsection-description">Add up to 5 additional images for the project slideshow</p>
                                        <MultiImageUpload
                                            images={projectForm.images}
                                            onImagesChange={(images) => setProjectForm({ ...projectForm, images })}
                                            maxImages={5}
                                        />
                                    </div>

                                    <div className="form-actions-footer">
                                        <button type="submit" disabled={submitLoading} className="btn-publish">
                                            {submitLoading ? <>Saving...</> : (editingProjectId ? <>Update Project</> : <>Publish Project</>)}
                                        </button>
                                        {editingProjectId && (
                                            <>
                                                <button type="button" onClick={cancelEdit} className="btn-secondary"><FaTimes /> Cancel</button>
                                                <button type="button" onClick={() => { handleProjectDelete(editingProjectId); cancelEdit(); }} className="btn-danger"><FaTrash /> Delete</button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </FormCard>
                        </div>

                        <div className="content-section">
                            <div className="section-header">
                                <h3 className="section-title">Published Projects</h3>
                                <span className="item-count">{projects.length}</span>
                            </div>
                            {loading ? (
                                <div className="loading-state"><div className="spinner"></div><p>Loading...</p></div>
                            ) : projects.length === 0 ? (
                                <div className="empty-state"><FaProjectDiagram className="empty-icon" /><p>No projects published yet</p></div>
                            ) : (
                                <div className="content-grid">
                                    {projects.map((project) => (
                                        <div key={project._id} className="content-card">
                                            <div className="content-card-image">
                                                <img src={project.image} alt={project.title} />
                                                {project.category && <span className="content-card-badge">{project.category}</span>}
                                            </div>
                                            <div className="content-card-body">
                                                <h4>{project.title}</h4>
                                                <p>{project.description}</p>
                                            </div>
                                            <div className="content-card-actions">
                                                <button onClick={() => handleProjectEdit(project)} className="btn-action-edit"><FaEdit /></button>
                                                <button onClick={() => handleProjectDelete(project._id)} className="btn-action-delete"><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TESTIMONIALS TAB */}
                {activeTab === 'testimonials' && (
                    <div className="content-section">
                        <div className="section-header">
                            <h3 className="section-title">Manage Testimonials</h3>
                            <span className="item-count">{testimonials.length}</span>
                        </div>
                        {loading ? (
                            <div className="loading-state"><div className="spinner"></div></div>
                        ) : testimonials.length === 0 ? (
                            <div className="empty-state"><FaComments className="empty-icon" /><p>No testimonials yet</p></div>
                        ) : (
                            <div className="testimonials-content-grid">
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial._id} className={`testimonial-content-card ${testimonial.approved ? 'approved' : 'pending'}`}>
                                        <div className="testimonial-card-header">
                                            <div className="testimonial-card-info">
                                                <h4>{testimonial.name}</h4>
                                                <p className="testimonial-subtitle">{testimonial.postalAddress}</p>
                                                <p className="testimonial-subtitle">{testimonial.mobileNumber}</p>
                                            </div>
                                            <span className={`testimonial-card-status ${testimonial.approved ? 'approved' : 'pending'}`}>{testimonial.approved ? 'Published' : 'Pending'}</span>
                                        </div>
                                        <div className="testimonial-card-rating">{'⭐'.repeat(testimonial.rating)}</div>
                                        <p className="testimonial-card-text">"{testimonial.testimonialText}"</p>
                                        <div className="testimonial-card-actions">
                                            {!testimonial.approved ? (
                                                <button onClick={() => handleTestimonialApprove(testimonial._id)} className="btn-action-approve"><FaCheck /> Approve</button>
                                            ) : (
                                                <button onClick={() => handleTestimonialDeny(testimonial._id)} className="btn-action-deny"><FaTimes /> Unpublish</button>
                                            )}
                                            <button onClick={() => handleTestimonialDelete(testimonial._id, testimonial.name)} className="btn-action-delete"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TEAM MEMBERS TAB */}
                {activeTab === 'team' && (
                    <div className="admin-section-wrapper">
                        <div className="form-section">
                            <FormCard title={editingTeamId ? 'Update Team Member' : 'Add Team Member'} icon={editingTeamId ? <FaEdit /> : <FaPlus />}>
                                <form onSubmit={handleTeamSubmit} className="admin-form">
                                    <div className="form-group">
                                        <label htmlFor="team-name">Name <span className="required">*</span></label>
                                        <input id="team-name" type="text" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required placeholder="Full name" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="team-role">Role / Position <span className="required">*</span></label>
                                        <input id="team-role" type="text" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} required placeholder="e.g. Senior Architect" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="team-image">Profile Image <span className="required">*</span></label>
                                        <DragDropUpload imageUrl={teamForm.image} onImageUrlChange={(url) => setTeamForm({ ...teamForm, image: url })} label="Profile Image" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="team-linkedin">LinkedIn URL</label>
                                        <input id="team-linkedin" type="url" value={teamForm.linkedin} onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="team-instagram">Instagram URL</label>
                                        <input id="team-instagram" type="url" value={teamForm.instagram} onChange={(e) => setTeamForm({ ...teamForm, instagram: e.target.value })} placeholder="https://instagram.com/..." className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="team-mobile">Mobile Phone <span className="required">*</span></label>
                                        <input id="team-mobile" type="tel" value={teamForm.mobilePhone} onChange={(e) => setTeamForm({ ...teamForm, mobilePhone: e.target.value })} required placeholder="10-digit phone number" pattern="\d{10}" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="team-twitter">Twitter URL</label>
                                        <input id="team-twitter" type="url" value={teamForm.twitter} onChange={(e) => setTeamForm({ ...teamForm, twitter: e.target.value })} placeholder="https://twitter.com/..." className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="team-order">Display Order</label>
                                        <input id="team-order" type="number" value={teamForm.order} onChange={(e) => setTeamForm({ ...teamForm, order: parseInt(e.target.value) || 0 })} placeholder="0" className="form-input" />
                                    </div>
                                    <div className="form-actions-footer">
                                        <button type="submit" disabled={submitLoading} className="btn-publish">{submitLoading ? 'Saving...' : (editingTeamId ? 'Update' : 'Add')}</button>
                                        {editingTeamId && <button type="button" onClick={cancelEdit} className="btn-secondary"><FaTimes /> Cancel</button>}
                                    </div>
                                </form>
                            </FormCard>
                        </div>
                        <div className="content-section">
                            <div className="section-header">
                                <h3 className="section-title">Team Members</h3>
                                <span className="item-count">{teamMembers.length}</span>
                            </div>
                            {loading ? (
                                <div className="loading-state"><div className="spinner"></div></div>
                            ) : teamMembers.length === 0 ? (
                                <div className="empty-state"><FaUsers className="empty-icon" /><p>No team members yet</p></div>
                            ) : (
                                <div className="content-grid">
                                    {teamMembers.map((member) => (
                                        <div key={member._id} className="content-card team-card">
                                            <div className="content-card-image"><img src={member.image} alt={member.name} /></div>
                                            <h4>{member.name}</h4>
                                            <p className="team-role">{member.role}</p>
                                            <div className="social-badges">
                                                {member.linkedin !== '#' && <span className="social-badge">LinkedIn ✓</span>}
                                                {member.twitter !== '#' && <span className="social-badge">Twitter ✓</span>}
                                                {member.instagram !== '#' && <span className="social-badge">Instagram ✓</span>}
                                            </div>
                                            <small className="order-label">Order: {member.order}</small>
                                            <div className="content-card-actions">
                                                <button onClick={() => handleTeamEdit(member)} className="btn-action-edit"><FaEdit /></button>
                                                <button onClick={() => handleTeamDelete(member._id)} className="btn-action-delete"><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SERVICES TAB */}
                {activeTab === 'services' && (
                    <div className="admin-section-wrapper">
                        <div className="form-section">
                            <FormCard title={editingServiceId ? 'Update Service' : 'Add New Service'} icon={editingServiceId ? <FaEdit /> : <FaPlus />}>
                                <form onSubmit={handleServiceSubmit} className="admin-form">
                                    <div className="form-group">
                                        <label htmlFor="service-title">Title <span className="required">*</span></label>
                                        <input id="service-title" type="text" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required placeholder="e.g. Interior Consultation" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="service-description">Description <span className="required">*</span></label>
                                        <textarea id="service-description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required rows="4" placeholder="Describe this service..." className="form-textarea"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="service-icon">Icon / Emoji <span className="required">*</span></label>
                                        <input id="service-icon" type="text" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} required placeholder="e.g. 🎨" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="service-order">Display Order</label>
                                        <input id="service-order" type="number" value={serviceForm.order} onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) })} placeholder="0" className="form-input" />
                                    </div>
                                    <div className="form-actions-footer">
                                        <button type="submit" disabled={submitLoading} className="btn-publish">{submitLoading ? 'Saving...' : (editingServiceId ? 'Update' : 'Add')}</button>
                                        {editingServiceId && <button type="button" onClick={cancelEdit} className="btn-secondary"><FaTimes /> Cancel</button>}
                                    </div>
                                </form>
                            </FormCard>
                        </div>
                        <div className="content-section">
                            <div className="section-header">
                                <h3 className="section-title">Services</h3>
                                <span className="item-count">{services.length}</span>
                            </div>
                            {loading ? (
                                <div className="loading-state"><div className="spinner"></div></div>
                            ) : services.length === 0 ? (
                                <div className="empty-state"><FaCog className="empty-icon" /><p>No services yet</p></div>
                            ) : (
                                <div className="content-grid">
                                    {services.map((service) => (
                                        <div key={service._id} className="content-card">
                                            <div className="content-card-icon">{service.icon}</div>
                                            <h4>{service.title}</h4>
                                            <p>{service.description}</p>
                                            <small className="order-label">Order: {service.order}</small>
                                            <div className="content-card-actions">
                                                <button onClick={() => handleServiceEdit(service)} className="btn-action-edit"><FaEdit /></button>
                                                <button onClick={() => handleServiceDelete(service._id)} className="btn-action-delete"><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* DESIGNS TAB */}
                {activeTab === 'designs' && (
                    <div className="admin-section-wrapper">
                        <div className="form-section">
                            <FormCard title={editingDesignId ? 'Update Design' : 'Add New Design'} icon={editingDesignId ? <FaEdit /> : <FaPlus />}>
                                <form onSubmit={handleDesignSubmit} className="admin-form">
                                    <div className="form-group">
                                        <label htmlFor="design-title">Design Title <span className="required">*</span></label>
                                        <input id="design-title" type="text" value={designForm.title} onChange={(e) => setDesignForm({ ...designForm, title: e.target.value })} required placeholder="e.g. Modern Living Room" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="design-description">Description</label>
                                        <textarea id="design-description" value={designForm.description} onChange={(e) => setDesignForm({ ...designForm, description: e.target.value })} rows="3" placeholder="Describe this design..." className="form-textarea"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Design Image <span className="required">*</span></label>
                                        <div className="image-upload-options">
                                            <div className="upload-option">
                                                <h4>Upload from System</h4>
                                                <DragDropUpload imageUrl={designForm.imageUrl} onImageUrlChange={(url) => setDesignForm({ ...designForm, imageUrl: url })} label="Design Image" />
                                            </div>
                                            <div className="upload-divider">OR</div>
                                            <div className="upload-option">
                                                <h4>Use Image URL</h4>
                                                <input type="url" value={designForm.imageUrl} onChange={(e) => setDesignForm({ ...designForm, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" className="form-input" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="design-order">Display Order</label>
                                        <input id="design-order" type="number" value={designForm.order} onChange={(e) => setDesignForm({ ...designForm, order: parseInt(e.target.value) })} placeholder="0" className="form-input" />
                                    </div>
                                    <div className="form-actions-footer">
                                        <button type="submit" disabled={submitLoading} className="btn-publish">{submitLoading ? 'Saving...' : (editingDesignId ? 'Update' : 'Add')}</button>
                                        {editingDesignId && <button type="button" onClick={cancelEdit} className="btn-secondary"><FaTimes /> Cancel</button>}
                                    </div>
                                </form>
                            </FormCard>
                        </div>
                        <div className="content-section">
                            <div className="section-header">
                                <h3 className="section-title">Design Gallery</h3>
                                <span className="item-count">{designs.length}</span>
                            </div>
                            {loading ? (
                                <div className="loading-state"><div className="spinner"></div></div>
                            ) : designs.length === 0 ? (
                                <div className="empty-state"><FaPalette className="empty-icon" /><p>No designs yet</p></div>
                            ) : (
                                <div className="designs-grid">
                                    {designs.map((design) => (
                                        <div key={design._id} className="design-card">
                                            <div className="design-image-container">
                                                <img src={design.imageUrl} alt={design.title} />
                                            </div>
                                            <div className="design-info">
                                                <h4>{design.title}</h4>
                                                {design.description && <p className="design-desc">{design.description}</p>}
                                                <small className="order-label">Order: {design.order}</small>
                                            </div>
                                            <div className="design-card-actions">
                                                <button onClick={() => handleDesignEdit(design)} className="btn-action-edit"><FaEdit /></button>
                                                <button onClick={() => handleDesignDelete(design._id)} className="btn-action-delete"><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* CONTACTS / QUERIES TAB */}
                {activeTab === 'contacts' && (
                    <div className="content-section">
                        <div className="section-header">
                            <h3 className="section-title">Customer Queries & Messages</h3>
                            <span className="item-count">{contacts.length}</span>
                        </div>
                        {loading ? (
                            <div className="loading-state"><div className="spinner"></div><p>Loading...</p></div>
                        ) : contacts.length === 0 ? (
                            <div className="empty-state"><FaPhone className="empty-icon" /><p>No customer queries yet</p></div>
                        ) : (
                            <div className="contacts-grid">
                                {contacts.map((contact) => (
                                    <div key={contact._id} className={`contact-card ${contact.status}`}>
                                        <div className="contact-card-header">
                                            <div className="contact-info">
                                                <h4 className="contact-name">{contact.name}</h4>
                                                <p className="contact-email">{contact.email}</p>
                                                <p className="contact-phone">
                                                    <FaPhone style={{ marginRight: '8px' }} />
                                                    {contact.mobileNumber}</p>
                                                {contact.purpose && <p className="contact-purpose"><strong>Purpose:</strong> {contact.purpose}</p>}
                                            </div>
                                            <span className={`contact-status-badge ${contact.status}`}>{contact.status}</span>
                                        </div>
                                        <div className="contact-card-body">
                                            <p className="contact-message">"{contact.message}"</p>
                                            <small className="contact-date">
                                                {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                                            </small>
                                        </div>
                                        <div className="contact-card-actions">
                                            <button 
                                                onClick={() => handleWhatsAppReply(contact)} 
                                                className="btn-whatsapp"
                                                title="Reply via WhatsApp"
                                            >
                                                <FaWhatsapp /> Reply via WhatsApp
                                            </button>
                                            <button 
                                                onClick={() => handleContactDelete(contact._id)} 
                                                className="btn-action-delete"
                                                title="Delete this query"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} duration={4000} />}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                title="Delete Testimonial?"
                message="Are you sure you want to permanently delete this testimonial? This action cannot be undone."
                itemName={deleteModal.itemName}
                isLoading={deleteModal.isLoading}
                onConfirm={confirmTestimonialDelete}
                onCancel={() => setDeleteModal({ isOpen: false, itemType: '', itemId: '', itemName: '', isLoading: false })}
            />
        </div>
    );
};

export default AdminDashboard;
