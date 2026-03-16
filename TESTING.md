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

#### @ anastan588

PR with tests: [link](https://github.com/chebupell/SkillsZen/pull/45)

Implemented tests: </br>
- file [AuthFormLayout.test.tsx](SkillsZen/src/components/shared/AuthFormLayout.test.tsx) - tested rendering AuthFormLayout component</br>
- file [auth.test.tsx](SkillsZen/src/pages/auth/auth.test.tsx) - tested rendering Sign up page</br>
- file [protectedRoute.test.tsx](SkillsZen/src/pages/router/protectedRoure.test.tsx) - tested rendering Sign in page if user is not authentificated</br>
- file [router.test.tsx](SkillsZen/src/pages/router/router.test.tsx) - tested rendering pages from router</br>
