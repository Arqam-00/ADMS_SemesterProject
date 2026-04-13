import React, { useState, useEffect } from 'react';
import { getFamilyTree } from '../services/api';
import toast from 'react-hot-toast';

const FamilyTree = ({ cnic }) => {
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    parents: true,
    grandparents: true,
    siblings: true,
    spouse: true
  });

  useEffect(() => {
    if (cnic) {
      fetchFamilyTree();
    }
  }, [cnic]);

  const fetchFamilyTree = async () => {
    try {
      const response = await getFamilyTree(cnic);
      setFamilyData(response.data);
    } catch (error) {
      toast.error('Failed to load family tree');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading family tree...</div>;
  }

  if (!familyData) {
    return <div style={styles.noData}>No family data available</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌳 Family Tree</h2>
      
      {/* Self Card */}
      <div style={styles.selfCard}>
        <div style={styles.selfIcon}>👤</div>
        <div style={styles.selfInfo}>
          <h3>{familyData.self?.first_name} {familyData.self?.last_name}</h3>
          <p>CNIC: {familyData.self?.cnic}</p>
          <p>Gender: {familyData.self?.gender}</p>
          <p>Date of Birth: {new Date(familyData.self?.date_of_birth).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Parents Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('parents')}>
          <span style={styles.sectionIcon}>👪</span>
          <span style={styles.sectionTitle}>Parents</span>
          <span style={styles.expandIcon}>{expandedSections.parents ? '▼' : '▶'}</span>
        </div>
        {expandedSections.parents && (
          <div style={styles.sectionContent}>
            <div style={styles.parentGrid}>
              {/* Father */}
              <div style={styles.parentCard}>
                <div style={styles.parentIcon}>👨</div>
                {familyData.parents?.father ? (
                  <>
                    <p><strong>Father</strong></p>
                    <p>{familyData.parents.father.first_name} {familyData.parents.father.last_name}</p>
                    <p style={styles.smallText}>CNIC: {familyData.parents.father.cnic}</p>
                    {familyData.parents.father.date_of_birth && (
                      <p style={styles.smallText}>DOB: {new Date(familyData.parents.father.date_of_birth).toLocaleDateString()}</p>
                    )}
                  </>
                ) : (
                  <p style={styles.noDataText}>Father information not available</p>
                )}
              </div>
              
              {/* Mother */}
              <div style={styles.parentCard}>
                <div style={styles.parentIcon}>👩</div>
                {familyData.parents?.mother ? (
                  <>
                    <p><strong>Mother</strong></p>
                    <p>{familyData.parents.mother.first_name} {familyData.parents.mother.last_name}</p>
                    <p style={styles.smallText}>CNIC: {familyData.parents.mother.cnic}</p>
                    {familyData.parents.mother.date_of_birth && (
                      <p style={styles.smallText}>DOB: {new Date(familyData.parents.mother.date_of_birth).toLocaleDateString()}</p>
                    )}
                  </>
                ) : (
                  <p style={styles.noDataText}>Mother information not available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grandparents Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('grandparents')}>
          <span style={styles.sectionIcon}>👴👵</span>
          <span style={styles.sectionTitle}>Grandparents</span>
          <span style={styles.expandIcon}>{expandedSections.grandparents ? '▼' : '▶'}</span>
        </div>
        {expandedSections.grandparents && (
          <div style={styles.sectionContent}>
            {/* Paternal Grandparents */}
            <div style={styles.grandparentGroup}>
              <h4 style={styles.groupTitle}>Paternal (Father's Parents)</h4>
              <div style={styles.grandparentGrid}>
                <div style={styles.grandparentCard}>
                  <div style={styles.grandparentIcon}>👴</div>
                  {familyData.grandparents?.paternal?.grandfather ? (
                    <>
                      <p><strong>Grandfather</strong></p>
                      <p>{familyData.grandparents.paternal.grandfather.first_name} {familyData.grandparents.paternal.grandfather.last_name}</p>
                      <p style={styles.smallText}>CNIC: {familyData.grandparents.paternal.grandfather.cnic}</p>
                    </>
                  ) : (
                    <p style={styles.noDataText}>Not available</p>
                  )}
                </div>
                <div style={styles.grandparentCard}>
                  <div style={styles.grandparentIcon}>👵</div>
                  {familyData.grandparents?.paternal?.grandmother ? (
                    <>
                      <p><strong>Grandmother</strong></p>
                      <p>{familyData.grandparents.paternal.grandmother.first_name} {familyData.grandparents.paternal.grandmother.last_name}</p>
                      <p style={styles.smallText}>CNIC: {familyData.grandparents.paternal.grandmother.cnic}</p>
                    </>
                  ) : (
                    <p style={styles.noDataText}>Not available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Maternal Grandparents */}
            <div style={styles.grandparentGroup}>
              <h4 style={styles.groupTitle}>Maternal (Mother's Parents)</h4>
              <div style={styles.grandparentGrid}>
                <div style={styles.grandparentCard}>
                  <div style={styles.grandparentIcon}>👴</div>
                  {familyData.grandparents?.maternal?.grandfather ? (
                    <>
                      <p><strong>Grandfather</strong></p>
                      <p>{familyData.grandparents.maternal.grandfather.first_name} {familyData.grandparents.maternal.grandfather.last_name}</p>
                      <p style={styles.smallText}>CNIC: {familyData.grandparents.maternal.grandfather.cnic}</p>
                    </>
                  ) : (
                    <p style={styles.noDataText}>Not available</p>
                  )}
                </div>
                <div style={styles.grandparentCard}>
                  <div style={styles.grandparentIcon}>👵</div>
                  {familyData.grandparents?.maternal?.grandmother ? (
                    <>
                      <p><strong>Grandmother</strong></p>
                      <p>{familyData.grandparents.maternal.grandmother.first_name} {familyData.grandparents.maternal.grandmother.last_name}</p>
                      <p style={styles.smallText}>CNIC: {familyData.grandparents.maternal.grandmother.cnic}</p>
                    </>
                  ) : (
                    <p style={styles.noDataText}>Not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Siblings Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('siblings')}>
          <span style={styles.sectionIcon}>👥</span>
          <span style={styles.sectionTitle}>Siblings ({familyData.siblings?.length || 0})</span>
          <span style={styles.expandIcon}>{expandedSections.siblings ? '▼' : '▶'}</span>
        </div>
        {expandedSections.siblings && (
          <div style={styles.sectionContent}>
            {familyData.siblings && familyData.siblings.length > 0 ? (
              <div style={styles.siblingsGrid}>
                {familyData.siblings.map((sibling, index) => (
                  <div key={index} style={styles.siblingCard}>
                    <div style={styles.siblingIcon}>{sibling.gender === 'male' ? '👨' : '👩'}</div>
                    <p><strong>{sibling.first_name} {sibling.last_name}</strong></p>
                    <p style={styles.smallText}>{sibling.relationship}</p>
                    <p style={styles.smallText}>CNIC: {sibling.cnic}</p>
                    {sibling.date_of_birth && (
                      <p style={styles.smallText}>DOB: {new Date(sibling.date_of_birth).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noDataText}>No siblings found</p>
            )}
          </div>
        )}
      </div>

      {/* Spouse Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader} onClick={() => toggleSection('spouse')}>
          <span style={styles.sectionIcon}>💑</span>
          <span style={styles.sectionTitle}>Spouse</span>
          <span style={styles.expandIcon}>{expandedSections.spouse ? '▼' : '▶'}</span>
        </div>
        {expandedSections.spouse && (
          <div style={styles.sectionContent}>
            {familyData.spouse ? (
              <div style={styles.spouseCard}>
                <div style={styles.spouseIcon}>{familyData.spouse.first_name ? '👫' : '❓'}</div>
                <div>
                  <p><strong>{familyData.spouse.first_name} {familyData.spouse.last_name}</strong></p>
                  <p style={styles.smallText}>CNIC: {familyData.spouse.cnic}</p>
                  {familyData.spouse.marriage_date && (
                    <p style={styles.smallText}>Married: {new Date(familyData.spouse.marriage_date).toLocaleDateString()}</p>
                  )}
                  {familyData.spouse.divorce_date && (
                    <p style={styles.smallText}>Divorced: {new Date(familyData.spouse.divorce_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ) : (
              <p style={styles.noDataText}>No spouse information available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px'
  },
  selfCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  selfIcon: {
    fontSize: '50px',
    marginRight: '15px'
  },
  selfInfo: {
    flex: 1
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '15px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    backgroundColor: '#ecf0f1',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.2s'
  },
  sectionIcon: {
    fontSize: '20px',
    marginRight: '10px'
  },
  sectionTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: '16px'
  },
  expandIcon: {
    fontSize: '12px',
    color: '#7f8c8d'
  },
  sectionContent: {
    padding: '15px',
    borderTop: '1px solid #ddd'
  },
  parentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  parentCard: {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  parentIcon: {
    fontSize: '40px',
    marginBottom: '5px'
  },
  grandparentGroup: {
    marginBottom: '20px'
  },
  groupTitle: {
    marginBottom: '10px',
    color: '#2c3e50',
    borderLeft: '3px solid #3498db',
    paddingLeft: '10px'
  },
  grandparentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  grandparentCard: {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  grandparentIcon: {
    fontSize: '35px',
    marginBottom: '5px'
  },
  siblingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px'
  },
  siblingCard: {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  siblingIcon: {
    fontSize: '35px',
    marginBottom: '5px'
  },
  spouseCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    gap: '15px'
  },
  spouseIcon: {
    fontSize: '40px'
  },
  smallText: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '5px'
  },
  noDataText: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: '14px',
    padding: '10px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#7f8c8d'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#95a5a6'
  }
};

export default FamilyTree;