import { useApi } from "@/hooks/useApi";

const CompanyProfileApi = () => {
  const axiosApi = useApi();
  const companyApiBase = '/api/v1/company'

  const updateCompanyProfileInfo = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/profile`,
        "PATCH",
        payload,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createCompanyProjects = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/projects`,
        "POST",
        payload,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateCompanyProjects = async (projectId: string, payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/projects/${projectId}`,
        "PATCH",
        payload,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteCompanyProject = async (projectId: string) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/projects/${projectId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createCompanyCaseStudy = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/case-studies`,
        "POST",
        payload,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateCompanyCaseStudy = async (caseId:string, payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/case-studies/${caseId}`,
        "PATCH",
        payload,
       // {},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteCompanyCaseStudy = async (caseId:string) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/case-studies/${caseId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createCompanyTeamMember = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/team-members`,
        "POST",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateCompanyTeamMember = async (teamMemberId:string, payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/team-members/${teamMemberId}`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteCompanyTeamMember = async (memberId:string) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/team-members/${memberId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createCompanyPartner = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/partnerships`,
        "POST",
        payload,
       // {},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateCompanyPartner = async (partnerId:string, payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/partnerships/${partnerId}`,
        "PATCH",
        payload,
        //{},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteCompanyPartner = async (partnerId:string) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/partnerships/${partnerId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const createCompanyTestimonial = async (payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/testimonials`,
        "POST",
        payload,
        //{},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateCompanyTestimonial = async (testimonialId:string, payload: any) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/testimonials/${testimonialId}`,
        "PATCH",
        payload,
        //{},
        {
          "Content-Type": "multipart/form-data",
        }
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const deleteCompanyTestimonial = async (testimonialId:string) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/testimonials/${testimonialId}`,
        "DELETE"
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const updateCompanySocials = async (payload:SocialNetwork) => {
    try {
      const response = await axiosApi(
        `${companyApiBase}/socials`,
        "PATCH",
        payload
      );
      return response;
    } catch (error: any) {
      return error.response ?? error;
    }
  };

  const getCompany = async (companyId:string, recentJobCount = 3) => {
    try {
      const {status, data} = await axiosApi(
        `${companyApiBase}/${companyId}`,
        "GET",{},
        {recentJobCount}
      );
      if(status === 200 && data){
        return data
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  return {
    updateCompanyProfileInfo,
    createCompanyProjects,
    updateCompanyProjects,
    deleteCompanyProject,
    createCompanyCaseStudy,
    updateCompanyCaseStudy,
    deleteCompanyCaseStudy,
    createCompanyTeamMember,
    updateCompanyTeamMember,
    deleteCompanyTeamMember,
    createCompanyPartner,
    updateCompanyPartner,
    deleteCompanyPartner,
    createCompanyTestimonial,
    updateCompanyTestimonial,
    deleteCompanyTestimonial,
    updateCompanySocials,
    getCompany
  };
};

export default CompanyProfileApi;
