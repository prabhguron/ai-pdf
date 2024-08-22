'use client';
import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@/components/form/TextField';
import { toast } from 'react-toastify';
import NebulaiApi from '@/neb-api/NebulaiApi';
import { fetchUserProfile } from '@/redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { FaFacebook, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

const validate = Yup.object().shape({
  facebook: Yup.string().matches(
    /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_\.]+$/,
    'Enter correct url!'
  ),
  twitter: Yup.string().matches(
    /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_\.]+$/,
    'Enter correct url!'
  ),
  linkedin: Yup.string().matches(
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-]+$/,
    'Enter correct url!'
  ),
  discord: Yup.string().matches(
    /^https?:\/\/(www\.)?discord\.gg\/[a-zA-Z0-9]+$/,
    'Enter correct url!'
  ),
});
const SocialNetworkBox = () => {
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.auth);
  const talentProfile = userProfile as TalentUserProfile;
  const { updateTalentSocials } = NebulaiApi();

  const saveSocialNetworkHandler = async (socialLinks: SocialNetwork) => {
    const allValuesEmpty = Object.values(socialLinks).every((value) => !value);
    if (allValuesEmpty) return;
    try {
      const { status } = await updateTalentSocials(socialLinks);
      if (status === 200) {
        dispatch(fetchUserProfile());
        toast.success('Updated Social Links');
        return;
      }
    } catch (error) {}
    toast.error('Something went wrong');
  };

  const socialInit: SocialNetwork = {
    facebook: talentProfile?.socialNetwork?.facebook || '',
    twitter: talentProfile?.socialNetwork?.twitter || '',
    linkedin: talentProfile?.socialNetwork?.linkedin || '',
    discord: talentProfile?.socialNetwork?.discord || '',
  };

  return (
    <Formik
      initialValues={socialInit}
      validationSchema={validate}
      onSubmit={saveSocialNetworkHandler}
      enableReinitialize
    >
      {(formik) => (
        <Form className='default-form'>
          <div className='row'>
            <div className='form-group col-lg-6 col-md-12'>
              <TextField
                label='Facebook'
                name='facebook'
                type='text'
                autoComplete='off'
                placeholder='https://www.facebook.com/your_username'
              />
              <FaFacebook />
            </div>

            {/* <!-- Input --> */}
            <div className='form-group col-lg-6 col-md-12'>
              <TextField
                label='Twitter'
                name='twitter'
                type='text'
                autoComplete='off'
                placeholder='https://www.twitter.com/your_username'
              />
              <FaTwitter />
            </div>

            {/* <!-- Input --> */}
            <div className='form-group col-lg-6 col-md-12'>
              <TextField
                label="LinkedIn"
                name="linkedin"
                type="text"
                autoComplete="off"
                placeholder="https://www.linkedin.com/in/your_username"
              />
              <FaLinkedin />
            </div>

            {/* <!-- Input --> */}
            <div className='form-group col-lg-6 col-md-12'>
              <TextField
                label='Discord'
                name='discord'
                type='text'
                autoComplete='off'
                placeholder="https://www.discord.gg/invite_id"
              />
              <FaDiscord />
            </div>

            {/* <!-- Input --> */}
            <div className='form-group col-lg-6 col-md-12'>
              <button type='submit' className='theme-btn btn-style-one'>
                Save
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SocialNetworkBox;
