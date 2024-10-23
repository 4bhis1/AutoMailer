const info = `
Sincerely,
Abhishek Kumar

Email : absk8634@gmail.com
Linkedin : https://www.linkedin.com/in/4bhis1/
Phone : 7805969406
`

const backendContent = () => {
    const subject = "Looking for the opportunities"
    const content = `Hello,

I hope this message finds you well. My name is Abhishek Kumar, and I am a Backend Developer with 2.9 years of experience specializing in MERN stack development. I am actively seeking a role where I can leverage my skills and contribute to your organization’s backend development efforts.

I have attached my resume for your review. I would appreciate it if you could let me know of any opportunities that align with my experience and skill set.

Thank you for your time and consideration. I look forward to hearing from you.

${info}
    `
    return {
        content,
        subject
    }
}

const frontendContent = () => {
    const subject = "Looking for the opportunities"
    const content = `Hello,

I hope you're doing well. My name is Abhishek Kumar, and I am a Fullstack Developer with 2.9 years of experience, primarily working with the MERN stack. I am seeking opportunities to contribute to your organization in a frontend development role.

Please find my resume attached for your review. I would appreciate it if you could inform me of any suitable roles that align with my skills and experience.

Thank you for your time and consideration. I look forward to hearing from you.

${info}
    `
    return {
        content,
        subject
    }
}

const info1 = `
Warm regards,
Abhishek Kumar

Email : absk8634@gmail.com  
Linkedin : https://www.linkedin.com/in/4bhis1/`
const refererContent = (name, jobLink, companyName) => {
    const subject = `Referral Request for Software Engineer Role at ${companyName}.`
    const content = `Hello ${name},

I hope you're doing well. I am a software engineer with nearly 3 years of experience specializing in MERN stack development. I’m reaching out to express my interest in opportunities at ${companyName}. I would greatly appreciate it if you could kindly consider my application using the referral.

jobLink : ${jobLink}

Attached is my resume for your reference. I would be grateful for any guidance or assistance you can offer in the referral process.

Thank you for your time and consideration. I look forward to the possibility of working together.

${info1}
    `
    return { subject, content }
}


const refererWithoutContent = (name, companyName) => {
    const subject = `Referral Request for Software Engineer Role at ${companyName}.`
    const content = `Hello ${name},

I hope you're doing well. I am a software engineer with nearly 3 years of experience specializing in MERN stack development. I’m reaching out to express my interest in opportunities at ${companyName}.

Attached is my resume for your reference. I would be grateful for any guidance or assistance you can offer in the referral process.

Thank you for your time and consideration. I look forward to the possibility of working together.

${info1}
    `
    return { subject, content }
}

module.exports = {
    backendContent,
    frontendContent,
    refererContent,
    refererWithoutContent
}