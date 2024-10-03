import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentEnv } from '../../redux/reducers/CurrentEnvSlice/currentEnvSlice';

const CurrentEnvInitializer = () => {
  const dispatch = useDispatch();

  /**
   * Load current environment from the script tag
   */
  useEffect(() => {
    const scriptTag = document.querySelector('script[data-inline-id="env"]');

    if (scriptTag) {
      try {
        const envData = JSON.parse(scriptTag.innerHTML);
        dispatch(setCurrentEnv(envData.ENV));
      } catch (e) {
        console.error('Cannot read current env', e);
      }
    }
  }, [dispatch]);

  return null;
};

export default CurrentEnvInitializer;
