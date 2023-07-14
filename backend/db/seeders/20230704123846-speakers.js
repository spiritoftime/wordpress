"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("speakers", [
      {
        first_name: "Harrison",
        last_name: "Moris",
        country: "Bhutan",
        title: "Prof",
        email: "Harrison@gmail.com",
        organisation: "KFC",
        biography: "KFC is a company that sells KFC",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Bob",
        last_name: "Ng",
        country: "Malaysia",
        title: "Dr",
        email: "Bob@gmail.com",
        organisation: "Macs",
        biography: "Macs is a company that sells Macs",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "John",
        last_name: "Doe",
        country: "USA",
        title: "Prof",
        email: "john.doe@example.com",
        organisation: "Example University",
        biography:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tristique fringilla urna, id posuere sapien ultrices at. Nam id leo id eros mollis mattis. Ut lacinia, orci ut malesuada lobortis, justo augue laoreet quam, in interdum enim orci eu leo. Suspendisse commodo interdum augue, ac interdum est. Sed placerat lectus augue, dictum placerat sapien tempus ut. Curabitur mattis vel arcu mattis tincidunt. Suspendisse fermentum arcu quis orci rutrum convallis. Quisque fermentum imperdiet vulputate. Nulla sit amet risus nec est ullamcorper tristique at vel elit. In hac habitasse platea dictumst. Sed condimentum feugiat dui, ac sagittis lectus consequat ut. Aliquam sollicitudin pharetra est, et interdum purus rutrum quis. Ut pharetra sem vitae scelerisque eleifend.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        country: "Indonesia",
        title: "Dr",
        email: "jane.smith@example.com",
        organisation: "Sample Hospital",
        biography:
          "Vivamus a dapibus felis. Nulla sed congue neque. Aliquam erat volutpat. Aliquam aliquet facilisis suscipit. Mauris lectus risus, fringilla eget dapibus at, faucibus sit amet justo. Vestibulum nec rutrum dolor. Etiam eu pharetra massa, eu blandit nunc. Aenean non nisi eu ipsum convallis suscipit. Donec porttitor faucibus consequat.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Michael",
        last_name: "Johnson",
        country: "India",
        title: "Prof",
        email: "michael.johnson@example.com",
        organisation: "Sample Company",
        biography:
          "Mauris odio arcu, volutpat eu viverra id, pulvinar ut nisi. Donec sit amet tempor ex. Phasellus purus felis, mattis vitae ornare vel, rutrum a diam. Vivamus vehicula consequat sagittis. Aenean placerat odio sed est ullamcorper, in facilisis dolor consequat. Integer nibh arcu, mattis ut ultrices sit amet, vulputate sed dolor. Nullam imperdiet aliquam magna, sit amet efficitur tortor. Maecenas aliquet lorem id ornare bibendum. Nunc elementum diam ac tempus porttitor. Maecenas sed gravida massa, eget porttitor nibh. Suspendisse potenti. Duis nec tortor at purus cursus vestibulum ac a mi. Sed accumsan nunc in hendrerit lacinia. Donec non erat et est auctor vestibulum.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Emily",
        last_name: "Wilson",
        country: "Singapore",
        title: "Dr",
        email: "emily.wilson@example.com",
        organisation: "Research Institute",
        biography:
          "Cras sit amet aliquet dolor, id pretium tellus. Donec auctor molestie tortor, in maximus magna dictum sed. Sed et urna sed orci cursus tempor vitae nec urna. Phasellus sed ante quis erat bibendum vulputate. Duis laoreet leo in ante dapibus, vitae blandit felis bibendum. Morbi a auctor lorem. Sed sollicitudin tellus non est volutpat consequat. Pellentesque a ante eu arcu maximus rhoncus. Ut maximus iaculis libero at sodales. Mauris tempor magna vel cursus tempor.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "David",
        last_name: "Lee",
        country: "China",
        title: "Prof",
        email: "david.lee@example.com",
        organisation: "Tech Solutions",
        biography:
          "Nunc et imperdiet risus. Nullam et lacus erat. Quisque at gravida tortor. Fusce imperdiet massa vel neque pharetra malesuada. Vestibulum finibus malesuada laoreet. Nullam libero urna, maximus vel magna sit amet, dapibus vehicula nisl. Ut imperdiet, nibh et condimentum lacinia, ligula libero blandit augue, in sodales risus erat in leo. Phasellus vitae dapibus quam, id molestie eros. Sed at faucibus nisl, vel aliquet quam. Ut sed tortor in felis vehicula aliquet. In tristique dolor purus, varius elementum nibh efficitur quis. Aliquam leo tortor, posuere sit amet pharetra convallis, imperdiet sed leo.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Sarah",
        last_name: "Taylor",
        country: "Japan",
        title: "Dr",
        email: "sarah.taylor@example.com",
        organisation: "Design Studio",
        biography:
          "Ut tincidunt urna id feugiat imperdiet. Nunc vitae tellus tortor. Proin nec arcu neque. Morbi ac quam laoreet, bibendum ipsum id, tristique mi. Integer tincidunt a dolor a rhoncus. Nulla a aliquam libero. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc id tincidunt arcu. Aliquam condimentum pretium eleifend. In sit amet odio eleifend, pretium felis non, posuere neque. Etiam fringilla lacinia ultrices. Integer egestas turpis ac erat dignissim lacinia. Nam in erat non risus tempus tempor. Aenean faucibus massa urna, in sagittis purus sollicitudin pretium.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Mark",
        last_name: "Davis",
        country: "Canada",
        title: "Prof",
        email: "mark.davis@example.com",
        organisation: "Financial Services",
        biography:
          "Maecenas velit turpis, dictum nec porttitor id, tincidunt vitae diam. Morbi eleifend volutpat enim quis efficitur. Nulla at ligula id massa interdum ornare eu sit amet ipsum. Phasellus auctor tortor mattis nunc hendrerit eleifend. Aliquam euismod diam erat, pretium maximus risus scelerisque ut. Integer congue sem quam, at consectetur felis hendrerit non. Mauris et nisi dignissim, maximus nunc a, feugiat libero. Mauris nec ex at ex congue blandit eget a odio. Nullam rhoncus enim erat, et ultricies arcu semper at. Cras sed augue non augue consequat placerat. Aenean lacinia sodales luctus. Aenean eget velit vitae tortor laoreet facilisis. Sed sollicitudin condimentum mauris, in molestie urna maximus quis.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Laura",
        last_name: "Miller",
        country: "USA",
        title: "Dr",
        email: "laura.miller@example.com",
        organisation: "Marketing Agency",
        biography:
          "Mauris accumsan urna ut rutrum tristique. Praesent elit quam, ultrices at eros a, tincidunt placerat ipsum. Sed rhoncus, lacus sed venenatis rhoncus, nisl odio mattis dolor, vitae pharetra lorem neque a nunc. Praesent neque libero, varius vitae lacinia bibendum, dictum et nisi. Mauris sit amet turpis a velit commodo iaculis. Mauris vel nunc dui. Nullam ultrices ex arcu, vel ornare libero finibus a. Curabitur dignissim blandit velit sed scelerisque. Mauris consequat ante nec arcu dignissim interdum. Integer nec finibus diam. Maecenas mollis, tortor ut placerat dapibus, elit risus pharetra diam, vel vulputate ante felis a ante. Ut sed scelerisque massa, a sollicitudin diam. Nulla placerat turpis nec egestas placerat. Phasellus ultrices augue ligula, non eleifend enim facilisis eget.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Daniel",
        last_name: "Wilson",
        country: "Australia",
        title: "Prof",
        email: "daniel.wilson@example.com",
        organisation: "Tech Company",
        biography:
          "Fusce accumsan consequat ante, sed eleifend magna finibus ac. Nullam laoreet tempus mauris nec tristique. Praesent condimentum porttitor ipsum, a tempus ex tempus sit amet. Aliquam orci ex, varius eu ipsum eu, pulvinar congue ex. Aliquam et imperdiet purus. Nunc porta vitae erat cursus condimentum. Nulla sed lorem faucibus, auctor urna at, tristique orci. Maecenas quis massa a dui dictum consequat non at magna. Nunc aliquam rhoncus vestibulum. Quisque non tincidunt libero. Maecenas eu pellentesque lacus. Phasellus sodales nibh sit amet fermentum congue.",
        photo_url: "",
        is_admin: false,
      },
      {
        first_name: "Olivia",
        last_name: "Walker",
        country: "South Korea",
        title: "Prof",
        email: "olivia.walker@example.com",
        organisation: "Consulting Firm",
        biography:
          "Suspendisse egestas nunc nunc, luctus auctor urna lacinia ullamcorper. Ut consequat vehicula interdum. Praesent finibus nisl magna, eleifend consequat justo semper ac. Fusce ut eros sit amet magna imperdiet aliquet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ultrices ante nibh, non fringilla erat aliquet nec. Maecenas hendrerit erat et mi consectetur viverra. Pellentesque egestas aliquet magna at condimentum.",
        photo_url: "",
        is_admin: false,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("speakers", null, {});
  },
};
