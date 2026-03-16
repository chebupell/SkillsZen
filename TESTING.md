## TESTS

### Team members

#### @ t-gladkaya

PR with tests: [link](https://github.com/chebupell/SkillsZen/pull/41)

Implemented tests: </br>
- file [backButton.test.tsx](SkillsZen/src/components/shared/backButton.test.tsx) - verified button label and ensured navigation triggers navigate(-1) on click</br>
- file [exerciseSubPage.test.tsx](SkillsZen/src/pages/exercises/exerciseSubPage/exerciseSubPage.test.tsx) - tested rendering of dynamic content (titles, progress) and conditional display of status-specific tags</br>
- file [inProgressTag.test.tsx](SkillsZen/src/pages/exercises/tags/inProgressTag.test.tsx) - "In Progress" status rendering</br>
- file [retryTag.test.tsx](SkillsZen/src/pages/exercises/tags/retryTag.test.tsx) - verified "Try Again" status rendering</br>
- file [startTag.test.tsx](SkillsZen/src/pages/exercises/tags/startTag.test.tsx) - verified "Not Started" status rendering</br>
- file [successTag.test.tsx](SkillsZen/src/pages/exercises/tags/successTag.test.tsx) - verified "Completed" status rendering</br>