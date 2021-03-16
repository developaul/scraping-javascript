const btnScrapProfile = document.getElementById('scrap-profile');

btnScrapProfile.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab != null) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapingProfile,
        });
    }
});

function scrapingProfile() {

    const data = {
        personalInformation: {},
        educationInformation: {},
        experienceInformation: {}
    };

    let educations = [];
    let experiences = [];

    window.addEventListener('scroll', () => {

        // Personal information
        data.personalInformation.nameProfile = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul li")?.innerText || '';
        data.personalInformation.jobProfile = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 h2")?.innerText || '';
        data.personalInformation.locationProfile = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul.pv-top-card--list-bullet li")?.innerText || '';

        document.querySelector('#line-clamp-show-more-button')?.click();
        data.personalInformation.aboutprofile = document.querySelector('section.pv-about-section p.pv-about__summary-text span')?.innerText || '';

        // Education Information
        document.querySelector('#education-section > div.pv-profile-section__actions-inline button.pv-profile-section__see-more-inline')?.click();
        const elementsEducations = document.querySelectorAll('#education-section > ul li');
        elementsEducations.forEach((elementEducation => {
            const elementContainerEducation = elementEducation.firstElementChild.firstElementChild.firstElementChild?.lastElementChild;

            const period = {
                startDate: elementContainerEducation.children.item(1)?.lastElementChild?.firstElementChild?.innerText || '',
                endDate: elementContainerEducation.children.item(1)?.lastElementChild?.lastElementChild?.innerText || ''
            }

            const educationCentral = elementContainerEducation.firstElementChild.firstElementChild?.innerText || '';

            const elementLevelsStudies = elementContainerEducation.firstElementChild.querySelectorAll('p');

            let levelStudies = '';
            elementLevelsStudies.forEach(elementLevelStudies => {
                levelStudies += elementLevelStudies.lastElementChild?.innerText || '';
            })

            const existsEducation = educations.some(education => (
                (education.educationCentral === educationCentral) ||
                (education.levelStudies === levelStudies) ||
                (education.period.startDate === period.startDate) ||
                (education.period.endDate === period.endDate)
            ));

            educations = (existsEducation) ? [...educations] : [...educations, { educationCentral, period, levelStudies }];

        }));
        data.educationInformation.educations = educations;


        // experience Information
        document.querySelector('#experience-section > div.pv-experience-section__see-more button.pv-profile-section__see-more-inline')?.click();
        const elementsExperiences = document.querySelectorAll('#experience-section > ul li');
        elementsExperiences.forEach(elementExperince => {

            const elementsContainersExperience = elementExperince.firstElementChild.firstElementChild.firstElementChild.firstElementChild?.lastElementChild?.children;

            const position = elementsContainersExperience?.item(0)?.innerText || '';
            const company = elementsContainersExperience?.item(2)?.innerText || '';
            const period = {
                dateRange: elementsContainersExperience?.item(3)?.children.item(0)?.lastElementChild?.innerText || '',
                dateDuration: elementsContainersExperience?.item(3)?.children.item(1)?.lastElementChild?.innerText || '',
            }

            const existsExperience = experiences.some(experience => (
                (experience.position === position) ||
                (experience.company === company) ||
                (experience.period.dateRange === period.dateRange) ||
                (experience.period.duration === period.dateDuration)
            ));

            experiences = (existsExperience) ? [...experiences] : [...experiences, { position, company, period }];

        });
        data.experienceInformation.experiences = experiences;

        console.log(data);
    });
}