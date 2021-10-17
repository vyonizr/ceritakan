import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useForm, SubmitHandler } from 'react-hook-form'
import { motion } from 'framer-motion'
import SyncLoader from 'react-spinners/SyncLoader'
import { Topic } from 'src/common/types'

const ERROR_MESSAGE = 'Ada yang salah nih. Coba di-refresh, ya.'
const MINIMUM_QUESTION_LENGTH = 20
const MAXIMUM_QUESTION_LENGTH = 100
const MAXIMUM_NAME_LENGTH = 15

type Inputs = {
  selectedTopicId: string
  question: string
  submitAs: string
  name?: string
  socialURL: string
}

const Submit = () => {
  const [topics, setTopics] = useState({
    isLoading: false,
    data: [] as Topic[],
    error: '',
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      selectedTopicId: '',
      question: '',
      submitAs: 'anonymous',
      name: '',
      socialURL: '',
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setTopics((state) => ({
          ...state,
          isLoading: true,
        }))

        const response = await fetch('/api/topics')
        const responseJSON = await response.json()
        setTopics({
          isLoading: false,
          data: responseJSON.data,
          error: '',
        })
      } catch (error) {
        setTopics({
          isLoading: false,
          data: [] as Topic[],
          error: ERROR_MESSAGE,
        })
      }
    }

    fetchTopics()
  }, [])

  const ErrorMessage = ({ message }: { message: string | undefined }) => {
    return <small className='text-red-400'>{message}</small>
  }

  return (
    <div className='h-screen w-72 custom-flex-center'>
      <Head>
        <title>Buat Pertanyaan | Ceritakan</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {topics.isLoading && (
        <div>
          <SyncLoader color='#60A5FA' loading={topics.isLoading} size={16} />
        </div>
      )}
      {!topics.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className='container flex-col custom-flex-center'
        >
          <h1 className='mb-5 text-3xl'>Buat Pertanyaan</h1>
          <form
            className='container flex-col custom-flex-center'
            onSubmit={handleSubmit(onSubmit)}
          >
            <select
              defaultValue=''
              className='mb-2 rounded form-select'
              {...register('selectedTopicId', { required: true })}
            >
              <option value='' disabled>
                Pilih Topik
              </option>
              {topics.data.map((topic, index) => (
                <option
                  key={index}
                  value={topic.id}
                >{`${topic.icon} ${topic.name}`}</option>
              ))}
            </select>
            {watch('selectedTopicId') !== '' && (
              <>
                <div className='container mb-4'>
                  <textarea
                    className='block w-full rounded resize-none p-3border-blue-900 form-textarea'
                    placeholder='Tulis pertanyaanmu di sini'
                    {...register('question', {
                      required: {
                        value: true,
                        message: 'Kamu harus mengisi pertanyaan',
                      },
                      minLength: {
                        value: MINIMUM_QUESTION_LENGTH,
                        message: `Pertanyaanmu tidak boleh kurang dari ${MINIMUM_QUESTION_LENGTH} karakter`,
                      },
                      maxLength: {
                        value: MAXIMUM_QUESTION_LENGTH,
                        message: `Pertanyaanmu tidak boleh lebih dari ${MAXIMUM_QUESTION_LENGTH} karakter`,
                      },
                    })}
                  />
                  {errors.question && (
                    <ErrorMessage message={errors.question.message} />
                  )}
                </div>
                <span>Kirim sebagai:</span>
                <select
                  defaultValue='anonymous'
                  className='rounded form-select'
                  {...register('submitAs')}
                >
                  <option value='anonymous'>😶 Anonim</option>
                  <option value='user'>😄 Non-Anonim</option>
                </select>
                {watch('submitAs') !== 'anonymous' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className='container'
                  >
                    <div className='my-2'>
                      <input
                        type='text'
                        className='container rounded form-input'
                        placeholder='Nama kamu'
                        {...register('name', {
                          required: {
                            value: watch('submitAs') !== 'anonymous',
                            message: 'Kamu harus memasukkan nama kamu',
                          },
                          maxLength: {
                            value: MAXIMUM_NAME_LENGTH,
                            message: `Nama tidak bisa lebih dari ${MAXIMUM_NAME_LENGTH} karakter`,
                          },
                        })}
                      />
                      {errors.name && (
                        <ErrorMessage message={errors.name.message} />
                      )}
                    </div>
                    <input
                      type='text'
                      className='container rounded form-input'
                      placeholder='Link sosmed (opsional)'
                      {...register('socialURL')}
                    />
                  </motion.div>
                )}
                <button
                  type='submit'
                  className='container self-end p-2 mt-5 font-medium text-white bg-blue-500 rounded disabled:opacity-0'
                >
                  Kirim
                </button>
              </>
            )}
          </form>
        </motion.div>
      )}
    </div>
  )
}

export default Submit
