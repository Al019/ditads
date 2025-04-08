import AppLogo from '@/Components/app-logo'
import WebLayout from '@/Layouts/WebLayout'

const Welcome = () => {
  return (
    <div className='pt-[104px] px-4 pb-10 min-h-screen flex flex-col items-center gap-6 justify-center'>
      <div className='size-52'>
        <AppLogo />
      </div>
      <div className='text-center uppercase'>
        <h1 className='font-black text-4xl text-primary'>ZAS</h1>
        <h1 className='font-black text-4xl max-w-[700px]'>DIGITAL INSTITUTE TRAINING AND DEVELOPMENT SERVICES</h1>
      </div>
      <p className='text-justify max-w-[900px]'>The Researcher’s Toolkit: A Step-by-Step Guidebook is a comprehensive resource thatequips researchers with essential skills and strategies for conducting effective and efficient research in today’s dynamic environments. In an era characterized by rapid technological advancements and the overwhelming availability of information, researchers face unique challenges and opportunities. This guidebook addresses these contemporary issues by providing practical advice, detailed step-by-step instructions, and illustrative examples tailored to the needs of modern research practices.</p>
    </div>
  )
}

Welcome.layout = page => <WebLayout children={page} />

export default Welcome